/**
 * This script is used to extract step definitions
 * from extensions' definition files.
 */

import { ExpressionStatement } from '@babel/types'
import assert from 'assert'
import fs from 'fs'
import chalk from 'chalk'
import { parse } from 'babylon'
import Mustache from 'mustache'
import { File, ModuleDeclaration, Statement } from 'babel-types'
import { isDefined } from '../src/utils/type_guards'

/**
 * Flag allowing to only check if README was generated
 */
const isCheck = process.argv[2] === '--check'

/**
 * README template file path.
 */
const readmeTemplatePath = './doc/README.tpl.md'

/**
 * README file path.
 */
const readmePath = './README.md'

export type DefinitionInfo = {
    type?: string
    matcher?: unknown
}

/**
 * Mustache partials.
 */
const partials = {
    definitions: `
\`\`\`yaml
Given:
{{#Given}}
  - {{&matcher}}
{{/Given}}
{{^Given}}
  # No definitions
{{/Given}}

When:
{{#When}}
  - {{&matcher}}
{{/When}}
{{^When}}
  # No definitions
{{/When}}

Then:
{{#Then}}
  - {{&matcher}}
{{/Then}}
{{^Then}}
  # No definitions
{{/Then}}
\`\`\`
`.trim(),
}

export type DefinitionFiles = {
    cli: string
    httpApi: string
    state: string
    fileSystem: string
    snapshot: string
}
/**
 * Available definition files.
 */
const definitionFiles: DefinitionFiles = {
    cli: './src/extensions/cli/definitions.ts',
    httpApi: './src/extensions/http_api/definitions.ts',
    state: './src/extensions/state/definitions.ts',
    fileSystem: './src/extensions/file_system/definitions.ts',
    snapshot: './src/extensions/snapshot/definitions.ts',
}

/**
 * Extension ids
 */
const extensions = Object.keys(definitionFiles)

/**
 * Loads file content.
 *
 * @param {string} file - File path
 */
const getFileContent = (file: string): Promise<string> =>
    new Promise((resolve, reject) => {
        console.log(chalk.yellow(`- loading file: ${chalk.white(file)}`))

        fs.readFile(file, (err, data) => {
            if (err) return reject(err)

            console.log(chalk.green(`- loaded file: ${chalk.white(file)}`))
            resolve(data.toString('utf8'))
        })
    })

/**
 * Writes file content.
 *
 * @param {string} file    - File path
 * @param {string} content - File content
 */
const writeFile = (file: string, content: string): Promise<void> =>
    new Promise((resolve, reject) => {
        fs.writeFile(file, content, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })

/**
 * Checks if AST node is a exports.install statement
 *
 * @param {Object} node - AST node
 * @return {boolean}
 */
const isExportInstall = (node: Statement | ModuleDeclaration): boolean => {
    return (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'AssignmentExpression' &&
        node.expression.operator === '=' &&
        node.expression.left.type === 'MemberExpression' &&
        node.expression.left.object.type === 'Identifier' &&
        node.expression.left.object.name === 'exports' &&
        node.expression.left.property.type === 'Identifier' &&
        node.expression.left.property.name === 'install'
    )
}

const extractModuleExportBody = (file: string, node?: any):  any => {
    if (
        node?.type !== 'ArrowFunctionExpression' ||
        !['BlockStatement', 'ArrowFunctionExpression'].includes(node.body.type)
    ) {
        console.error(
            chalk.red(`
! Unable to find definitions body for: ${file},
  definitions file should export definitions using:

    module.exports = module.exports = ({ Given, When, Then }) => {
        // definitions
    }
`)
        )
        process.exit(1)
    }

    if (node?.body?.type === 'BlockStatement') return node?.body?.body
    return extractModuleExportBody(file, node?.body)
}

/**
 * Checks if AST node is a cucumber step definition (Given/When/Then).
 *
 * @param {Object} node - AST node
 * @return {boolean}
 */
const isDefinition = (node: ExpressionStatement): boolean => {
    return (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'CallExpression' &&
        node.expression.callee.type === 'Identifier' &&
        ['Given', 'When', 'Then'].includes(node.expression.callee.name)
    )
}

/**
 * Extract step definition info from AST node.
 *
 * @param {string} file - Current definitions file
 * @param {Object} node - AST node to extract info from
 * @return {{type: string, matcher: *}}
 */
const extractDefinitionInfo = (file: string, node: ExpressionStatement): DefinitionInfo => {
    const [regex] = 'arguments' in node.expression ? node.expression.arguments : []
    if (!regex || regex.type !== 'RegExpLiteral') {
        console.error(
            chalk.red(`! Found invalid definition in: '${file}' at line ${node.loc?.start.line}`)
        )
        process.exit(1)
    }

    return {
        type:
            'callee' in node.expression && 'name' in node.expression.callee
                ? node.expression.callee.name
                : undefined,
        matcher: regex.extra?.raw,
    }
}

/**
 * Parses definitions from definitions code.
 *
 * @param {string} file - Current definitions file
 * @param {string} code - Definitions raw code
 */
const parseDefinitions = (file: string, code: string): Record<string, DefinitionInfo[]> => {
    console.log(chalk.yellow(`- parsing definitions file: ${chalk.white(file)}`))

    const parsed: File = parse(code)

    const [exportStatement] = parsed.program.body.filter((node) => isExportInstall(node))
    if (!exportStatement) {
        console.error(chalk.red(`! No 'module.exports' found in '${chalk.white(file)}'`))
        process.exit(1)
    }

    const nodeStatement =
        'expression' in exportStatement && 'right' in exportStatement.expression
            ? exportStatement.expression.right
            : undefined
    const body = extractModuleExportBody(file, nodeStatement)

    return body
        .filter((x: ExpressionStatement) => isDefinition(x))
        .map((def: ExpressionStatement) => extractDefinitionInfo(file, def))
        .reduce((byType: Record<string, DefinitionInfo[]>, { type, matcher }: DefinitionInfo) => {
            if (!type) return {}
            if (!byType[type]) byType[type] = []

            byType[type]?.push({ type, matcher })

            return byType
        }, {})
}

/**
 * Retrieves extension's definitions from file.
 *
 * @param {string} file - Definitions file
 */
const getDefinitionsFromFile = (file: string) => {
    return getFileContent(file).then((code) => parseDefinitions(file, code))
}

const generateReadme = async (): Promise<void> => {
    try {
        const definitions: Record<string, DefinitionInfo[]>[] = await Promise.all(
            extensions
                .map((extensionId) => {
                    const file = definitionFiles[extensionId as keyof DefinitionFiles]
                    if (file) return getDefinitionsFromFile(file)
                })
                .filter(isDefined)
        )

        const definitionsByExtension: Record<string, Record<string, DefinitionInfo[]>> = {}
        definitions.forEach((defs, index) => {
            const extension = extensions[index]
            if (extension) definitionsByExtension[extension] = defs
        })

        const readmeTemplateContent = await getFileContent(readmeTemplatePath)

        const renderedReadme = Mustache.render(
            readmeTemplateContent,
            {
                definitions: definitionsByExtension,
            },
            partials
        )

        if (isCheck) {
            const readmeContent = await getFileContent(readmePath)
            assert.strictEqual(
                renderedReadme,
                readmeContent,
                'README.md was not generated: Use `yarn readme`.'
            )
        } else {
            return writeFile(readmePath, renderedReadme)
        }
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

generateReadme().then((x) => x)
