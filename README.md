# veggies

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![styled with prettier][prettier-image]][prettier-url]

Veggies is an awesome cucumberjs boilerplate for API testing.
Great for testing APIs built upon Express, Koa, HAPI, Loopback, and others.

- [Installation](#installation)
- [Features](#features)
    - [API testing](#api-testing)
    
## Installation

Using npm:

``` sh
npm install @ekino/veggies
```

Or yarn:

``` sh
yarn add @ekino/veggies
```

Then all you have to do is installing the provided extensions:

``` javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, httpApi } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        httpApi.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install({
    baseUrl: 'http://localhost:3000',
})(defineSupportCode)

```

## Features

### API testing

[npm-image]: https://img.shields.io/npm/v/@ekino/veggies.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ekino/veggies
[travis-image]: https://img.shields.io/travis/ekino-node-staging/veggies.svg?style=flat-square
[travis-url]: https://travis-ci.org/ekino-node-staging/veggies
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[coverage-image]: https://img.shields.io/coveralls/ekino/veggies/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/ekino/veggies?branch=master
