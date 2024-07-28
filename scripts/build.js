#!/usr/bin/env node
import esbuild from 'esbuild'
import fg from 'fast-glob'
import fs from 'fs/promises'

const entryPoints = fg.sync(['src/**/*.{js,mjs,cjs}'])

await esbuild.build({
    entryPoints,
    outdir: 'lib/cjs',
    platform: 'node',
    sourcemap: false,
    target: 'es2023',
    format: 'cjs',
    logLevel: 'error',
    logOverride: {
        'empty-import-meta': 'silent',
    },
})

await fs.writeFile('lib/cjs/package.json', '{"type": "commonjs"}')
console.log('CJS compilation successful')
