import chalk from "chalk"
import { dirname, relative } from "node:path"
import { createInterface } from "node:readline/promises"
import { Project, type SourceFile } from "ts-morph"

async function main() {
	const project = new Project()

	project.addSourceFilesFromTsConfig("tsconfig.json")

	const invalidCaseFiles = project
		.getSourceFiles(["**/*", "!app/routes/**/*", "!*.config.{ts,js}", "app/root.tsx"])
		.filter((file) => kebabCaseFile(file) !== file.getBaseName())

	if (invalidCaseFiles.length === 0) {
		console.info(chalk.green("Everything is fine :)"))
		return
	}

	console.info(`Found ${invalidCaseFiles.length} files with invalid case:`)
	console.info()

	for (const file of invalidCaseFiles) {
		console.log(
			"  ",
			chalk.red(projectRelativeFilePath(file)),
			chalk.dim("->"),
			chalk.green(kebabCaseFile(file)),
		)
	}

	console.info()

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	const answer = await rl.question(`Continue? ${chalk.dim("(y/N)")} `)
	rl.close()

	if (answer.toLocaleLowerCase() !== "y") {
		console.error(chalk.green("No changes made."))
		return
	}

	for (const file of invalidCaseFiles) {
		console.info(
			chalk.dim(
				`Renaming ${chalk.whiteBright(projectRelativeFilePath(file))} to ${chalk.whiteBright(kebabCaseFile(file))}`,
			),
		)
		file.move(kebabCaseFile(file))
	}

	console.info(chalk.dim("Saving project..."))
	await project.save()

	console.info(chalk.green("Done"))
}

function projectRelativeFilePath(file: SourceFile): string {
	return relative(dirname(import.meta.dirname), file.getFilePath())
}

function kebabCaseFile(file: SourceFile): string {
	return `${kebabCase(file.getBaseNameWithoutExtension())}${file.getExtension()}`
}

function kebabCase(str: string) {
	return (
		str
			.match(/[A-Z]?[a-z0-9.]+/g)
			?.map((word) => word.toLowerCase())
			.join("-") ?? str
	)
}

if (import.meta.main) {
	main()
}
