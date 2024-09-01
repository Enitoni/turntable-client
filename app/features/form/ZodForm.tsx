import {
	type DefaultValue,
	type FormMetadata,
	FormProvider,
	FormStateInput,
	type SubmissionResult,
	getFormProps,
	useForm,
} from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { Form, useNavigation } from "@remix-run/react"
import type { ReactElement } from "react"
import type { ZodType } from "zod"

interface IdleState {
	status: "idle"
}

interface PendingState {
	status: "pending"
}

interface ErrorState {
	status: "error"
	errors: string[]
}

export type FormState = IdleState | PendingState | ErrorState

export type Fields<Schema extends Record<string, unknown>, Error = string[]> = ReturnType<
	FormMetadata<Schema, Error>["getFieldset"]
>

export interface ZodFormProps<T extends Record<string, unknown>> {
	schema: ZodType<T>
	lastResult: SubmissionResult | null
	initialValues?: DefaultValue<T>
	className?: string
	children: (fields: Fields<T>, state: FormState) => ReactElement
}

export function ZodForm<T extends Record<string, unknown>>(props: ZodFormProps<T>) {
	const { schema, className, initialValues, lastResult, children } = props
	const navigation = useNavigation()

	const [form, fields] = useForm({
		lastResult,
		defaultValue: initialValues,
		constraint: getZodConstraint(schema),
		shouldRevalidate: "onBlur",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
	})

	const getState = (): FormState => {
		if (navigation.state === "submitting") {
			return { status: "pending" } as const
		}

		if (lastResult?.status === "error") {
			return {
				status: "error",
				errors: form.errors ?? [],
			} as const
		}

		return { status: "idle" } as const
	}

	return (
		<FormProvider context={form.context}>
			<Form
				method="post"
				encType="multipart/form-data"
				className={className}
				{...getFormProps(form)}
			>
				{children(fields, getState())}
			</Form>
			<FormStateInput />
		</FormProvider>
	)
}
