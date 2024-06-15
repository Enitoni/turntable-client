import { LucidePlay } from "lucide-react"
import { Button } from "~/components/Button.tsx"

export default function DesignPage() {
	return (
		<main className="flex flex-col items-start gap-6 p-4">
			<Section title="Button">
				<Row>
					<Button>Confirm</Button>
					<Button icon={<LucidePlay />}>Play</Button>
				</Row>
			</Section>
		</main>
	)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section>
			<h2 className="mb-3 text-2xl font-medium leading-none font-display">{title}</h2>
			{children}
		</section>
	)
}

function Row({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-2">{children}</div>
}
