/* eslint no-console: "off" */
'use strict'

/**
 * This script is used to extract step definitions
 * from extensions' definition files.
 */

const fs = require('fs')
const chalk = require('chalk')
const { parse } = require('babylon')
const Mustache = require('mustache')

/**
 * README template file path.
 */
const readmeTemplatePath = './doc/README.tpl.md'

/**
 * README file path.
 */
const readmePath = './README.md'

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
`.trim()
}

/**
 * Available definition files.
 */
const definitionFiles = {
    cli: './src/extensions/cli/definitions.js',
    httpApi: './src/extensions/http_api/definitions.js',
    state: './src/extensions/state/definitions.js',
    fileSystem: './src/extensions/file_system/definitions.js'
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
const getFileContent = file =>
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
const writeFile = (file, content) =>
    new Promise((resolve, reject) => {
        fs.writeFile(file, content, err => {
            if (err) return reject(err)
            resolve(true)
        })
    })

/**
 * Checks if AST node is a default module export statement.
 *
 * @param {Object} node - AST node
 * @return {boolean}
 */
const isModuleExport = node => {
    return (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'AssignmentExpression' &&
        node.expression.operator === '=' &&
        node.expression.left.type === 'MemberExpression' &&
        node.expression.left.object.type === 'Identifier' &&
        node.expression.left.object.name === 'module' &&
        node.expression.left.property.type === 'Identifier' &&
        node.expression.left.property.name === 'exports'
    )
}

const extractModuleExportBody = (file, node) => {
    if (
        node.type !== 'ArrowFunctionExpression' ||
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

    if (node.body.type === 'BlockStatement') return node.body.body
    return extractModuleExportBody(file, node.body)
}

/**
 * Checks if AST node is a cucumber step definition (Given/When/Then).
 *
 * @param {Object} node - AST node
 * @return {boolean}
 */
const isDefinition = node => {
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
const extractDefinitionInfo = (file, node) => {
    const [regex] = node.expression.arguments
    if (!regex || regex.type !== 'RegExpLiteral') {
        console.error(
            chalk.red(`! Found invalid definition in: '${file}' at line ${node.loc.start.line}`)
        )
        process.exit(1)
    }

    return {
        type: node.expression.callee.name,
        matcher: regex.extra.raw
    }
}

/**
 * Parses definitions from definitions code.
 *
 * @param {string} file - Current definitions file
 * @param {string} code - Definitions raw code
 */
const parseDefinitions = (file, code) => {
    console.log(chalk.yellow(`- parsing definitions file: ${chalk.white(file)}`))

    const parsed = parse(code, {
        ranges: false,
        tokens: false
    })

    const [exportStatement] = parsed.program.body.filter(isModuleExport)
    if (!exportStatement) {
        console.error(chalk.red(`! No 'module.exports' found in '${chalk.white(file)}'`))
        process.exit(1)
    }

    const body = extractModuleExportBody(file, exportStatement.expression.right)

    return body
        .filter(isDefinition)
        .map(def => extractDefinitionInfo(file, def))
        .reduce((byType, { type, matcher }) => {
            if (!byType[type]) byType[type] = []

            byType[type].push({ type, matcher })

            return byType
        }, {})
}

/**
 * Retrieves extension's definitions from file.
 *
 * @param {string} file - Definitions file
 */
const getDefinitionsFromFile = file => {
    return getFileContent(file).then(code => parseDefinitions(file, code))
}

Promise.all(extensions.map(extensionId => getDefinitionsFromFile(definitionFiles[extensionId])))
    .then(definitions => {
        const definitionsByExtension = {}
        definitions.forEach((defs, index) => {
            definitionsByExtension[extensions[index]] = defs
        })

        return getFileContent(readmeTemplatePath).then(readmeTemplateContent => {
            return writeFile(
                readmePath,
                Mustache.render(
                    readmeTemplateContent,
                    {
                        definitions: definitionsByExtension
                    },
                    partials
                )
            )
        })
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
