[![veggies](https://raw.githubusercontent.com/ekino/veggies/master/doc/veggies-banner.png)](https://ekino.github.io/veggies/)

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![styled with prettier][prettier-image]][prettier-url]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

Veggies is an awesome cucumberjs library for API/CLI testing.
Great for testing APIs built upon Express, Koa, HAPI, Loopback and others.
It's also the perfect companion for testing CLI applications built with commander, meow & Co. 

- [Requirements](#requirements)
- [Installation](#installation)
- [Features](#features)
    - [API testing](#api-testing)
        - [Making a simple request](#making-a-simple-request-and-testing-its-status-code)
        - [Posting data](#posting-data)
        - [Posting data using fixture file](#posting-data-using-fixture-file)
        - [Using values issued by a previous request](#using-values-issued-by-a-previous-request)
        - [Using cookies](#using-cookies)
        - [Testing json response](#testing-json-response)
        - [Testing response headers](#testing-response-headers)
        - [Debugging failing API tests](#debugging-failing-api-tests)
        - [Type system](#type-system)
    - [CLI testing](#cli-testing) 
       - [Running a simple command](#running-a-simple-command-and-checking-its-exit-code)
       - [Testing a command error](#testing-a-command-error)
    - [File System testing](#file-system-testing)   
       - [Testing file content](#testing-file-content)
    - [Snapshot testing](#snapshot-testing)   
       - [API Snapshot testing](api-snapshot-testing)
       - [CLI Snapshot testing](cli-snapshot-testing)
       - [File Snapshot testing](file-snapshot-testing)
- [Extensions](#extensions)
    - [**state**](#state-extension) [install](#state-installation) | [gherkin expressions](#state-gherkin-expressions) | [low level API](#state-low-level-api)
    - [**fixtures**](#fixtures-extension) [install](#fixtures-installation) | [low level API](#fixtures-low-level-api)
    - [**http API**](#http-api-extension) [install](#http-api-installation) | [gherkin expressions](#http-api-gherkin-expressions) | [low level API](#http-api-low-level-api)
    - [**CLI**](#cli-extension) [install](#cli-installation) | [gherkin expressions](#cli-gherkin-expressions) | [low level API](#cli-low-level-api)
    - [**fileSystem**](#file-system-extension) [install](#file-system-installation) | [gherkin expressions](#file-system-gherkin-expressions) | [low level API](#file-system-low-level-api)
    - [**snapshot**](#snapshot-extension) [install](#snapshot-installation) | [low level API](#snapshot-low-level-api)
- [Helpers](#helpers)
    - [**cast**](#cast-helper) [usage](#cast-usage) | [add a type](#add-a-type)
- [Examples](#examples)   
    
## Requirements
    
- Node.js `>=6.0.0`
- cucumber `>=4.0.0`
    
## Installation

Using npm:

```sh
npm install @ekino/veggies
```

Or yarn:

```sh
yarn add @ekino/veggies
```

Then all you have to do is installing the provided extensions:

```javascript
// /support/world.js

const { setWorldConstructor } = require('cucumber')
const { state, fixtures, httpApi, cli } = require('@ekino/veggies')


setWorldConstructor(function() {
    state.extendWorld(this)
    fixtures.extendWorld(this)
    httpApi.extendWorld(this)
    cli.extendWorld(this)
})


state.install()
fixtures.install()
httpApi.install({
    baseUrl: 'http://localhost:3000'
})
cli.install()
```

## Features

### API testing

For full feature list, have a look at
[available gherkin expressions](#http-api-gherkin-expressions)
for the [dedicated extension](#http-api-extension).

#### Making a simple request and testing its status code

```gherkin
Scenario: Using GitHub API
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then response status code should be 200
```

#### Posting data

You can easily issue a POST request using json payload

```gherkin
Scenario: Creating a resource using json payload
  Given I set request json body
    | username | plouc |
    | gender   | male  |
  When I POST https://my-api.io/users
  Then response status code should be 201
```

You can also use form encoded values, all you have to do is
to change `json` for `form`

```gherkin
Scenario: Creating a resource using json payload
  Given I set request form body
    | username | plouc |
    | gender   | male  |
  When I POST https://my-api.io/users
  Then response status code should be 201
```

#### Posting data using fixture file

Putting large data payloads inside your scenarios can reduce legibility,
to improve this, you can use the [fixtures extension](#fixtures-extension) to define it.

```yaml
# /features/user/fixtures/user.yml

username: plouc
gender:   male
```

```gherkin
# /features/user/create_user.feature

Scenario: Creating a resource using json payload
  Given I set request form body from user
  When I POST https://my-api.io/users
  Then response status code should be 201
```

#### Using values issued by a previous request

Imagine you want to test a resource creation and then that you're able
to fetch this new entity through the API.

If resource id is generated by your API, it will be impossible to make
the second call because id is unknown. 

To solve this problem you have the ability to collect data from
a previous response, store it in the state and inject it at various
places using placeholders.

The following example calls the root GitHub API endpoint,
extracts the `emojis_url` value from the json response and
stores it in the current state under the `emojisUrl` key,
then it uses this value to make its next request.

```gherkin
Scenario: Using GitHub API
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  And I pick response json emojis_url as emojisUrl
  And I GET {{emojisUrl}}
  Then response status code should be 200
```

It's even possible to mix this approach with scenario outline to have more concise tests
(at the cost of clarity thought).

The following example will generates 3 scenario at runtime
using different response values for second request.

```gherkin
Scenario Outline: Fetching <key> API endpoint from root endpoint
  Given I set User-Agent request header to veggies/1.0
  When I GET https://api.github.com/
  Then response status code should be 200
  When I pick response json <key> as <key>
  And I GET {{<key>}}
  Then response status code should be 200

  Examples:
    | key              |
    | emojis_url       |
    | feeds_url        |
    | public_gists_url |
```

#### Using cookies

Cookies are disabled by default, but you've got the ability to enable/disable the feature using a gherkin `Given` expression.
Be warned that cookies do not persist across scenarios in order to ensure they're autonomous.
If you really need to keep a cookie for multiple scenarios, you should consider using a custom step definition
and/or using the [state extention](#state-extension) to store it.

```gherkin
Scenario: Enabling cookies
  Given I enable cookies
  # …
  
Scenario: Disabling cookies
  Given I disable cookies
  # …  
```

See [definitions](#http-api-gherkin-expressions) for all available cookies related gherkin expressions.

#### Testing json response

**veggies** gives you the ability to check json responses, the corresponding gherkin expression is:

```
/^(?:I )?json response should (fully )?match$/
```

Checking json response properties equal value:
 
```gherkin
Scenario: Fetching some json response from the internets
    When I GET http://whatever.io/things/1
    Then json response should match
      | field           | matcher | value |
      | name            | equal   | thing |
      | address.country | equal   | Japan |
``` 

Checking json response properties contain value:
 
```gherkin
Scenario: Fetching some json response from the internets
    When I GET http://whatever.io/things/1
    Then json response should match
      | field           | matcher | value |
      | name            | contain | ing   |
      | address.country | contain | Jap   |
``` 

Checking json response properties match value:

```gherkin
Scenario: Fetching some json response from the internets
    When I GET http://whatever.io/things/1
    Then json response should match
      | field           | matcher | value     |
      | name            | match   | ^(.+)ing$ |
      | address.country | match   | ^Jap(.+)$ |
``` 

By default this assertion does not check for full match.
Properties not listed will just be ignored, if you want a full match:

```gherkin
Scenario: Fetching some json response from the internets
    When I GET http://whatever.io/things/1
    Then json response should fully match
      | field           | matcher | value     |
      | name            | match   | ^(.+)ing$ |
      | address.country | equal   | Japan     |
```

Now if the json contains extra properties, the test will fail.

Available matchers are:

| matcher    | description                       |
|----------- |---------------------------------- |
| `match`    | property must match given regexp  |
| `matches`  | see `match`                       |
| `contain`  | property must contain given value |
| `contains` | see `contain`                     |
| `defined`  | property must not be `undefined`  |
| `present`  | see `defined`                     |     
| `equal`    | property must equal given value   |
| `equals`   | see `equal`                       |     

#### Testing response headers

In order to check response headers, you have the following gherkin expression available:

```
/^response header (.+) should (not )?(equal|contain|match) (.+)$/
```

It supports multiple combinations to verify header value conforms to what you expect.
This example illustrates its different features:

```gherkin
Scenario: Testing header related expectations
    When I GET http://whatever.io/
    Then response header X-Whatever-A should equal whatever
    And response header X-Whatever-B should not equal whatever
    And response header X-Whatever-C should contain part
    And response header X-Whatever-D should not contain part
    And response header X-Whatever-E should match ^(thing|other)$
    And response header X-Whatever-F should not match ^(thing|other)$
```

If the header does not exist, the test will fail.

#### Debugging failing API tests

When testing APIs using cucumber, we often faced situations were we didn't understand why a given test were failing.
The dirty fix was to add some nasty `console.log()` everywhere, that's why **veggies** provides helpers to dump response properties.

```gherkin
Scenario: Fetching something from the internets
    When I GET http://whatever.io/things
    And dump response body
    And dump response headers
    And dump response cookies
```

You'll now have the response body/headers/cookies dumped in your terminal.
You should disable those steps when the test is fixed as it can be noisy enough.

#### Type system

When testing json based APIs, which is a standard nowadays, you have to be aware of data types
for sending payloads or making assertions on received responses, that's why veggies provides
a lightweight type systems.

The following directives are available:

| directive            | type        | example                  | output                    |
|--------------------- |------------ |------------------------- |-------------------------- |
| `((undefined))`      | `undefined` | `((undefined))`          | `undefined`               |
| `((null))`           | `null`      | `((null))`               | `null`                    |
| `<value>((string))`  | `string`    | `hi((string))`           | `'hi'`                    |
| `<value>((number))`  | `number`    | `1((number))`            | `1`                       |
| `<value>((boolean))` | `boolean`   | `true((boolean))`        | `true`                    |
| `<value>((array))`   | `Array`     | `one,two,three((array))` | `['one', 'two', 'three']` |     

You can now use those directive for most of step definitions accepting data tables.

For example you can use it to post typed json data:

```gherkin
Scenario: Creating a resource using typed json payload
  Given I set request json body
    | username  | plouc((string))          |
    | team_id   | 1((number))              |
    | is_active | true((boolean))          |
    | hobbies   | drawing,hacking((array)) |
  When I POST https://my-api.io/users
  Then response status code should be 201
```

which will generate the following payload:

```json
{
  "username": "plouc",
  "team_id": 1,
  "is_active": true,
  "hobbies": [
    "drawing",
    "hacking"
  ]
}
```

### CLI testing

For full feature list, have a look at
[available gherkin expressions](#cli-gherkin-expressions)
for the [dedicated extension](#cli-extension).

#### Running a simple command and checking its exit code

```gherkin
Scenario: Getting info about installed yarn version
  When I run command yarn --version
  Then exit code should be 0
```

#### Testing a command error

```gherkin
Scenario: Running an invalid command
  When I run command yarn invalid
  Then exit code should be 1
  And stderr should contain error Command "invalid" not found.
```

### File System testing

#### Testing file content

In order to check file content, you have the following gherkin expression available:

```
/^file (.+) content (not )?(equal|contain|match) (.+)$/
```

It supports multiple combinations to verify file content conforms to what you expect.
This example illustrates its different features:

```gherkin
Scenario: Testing file content related expectations
    Then file sample_A.text content should equal whatever
    And file sample_B.text content should not equal whatever
    And file sample_C.text content should contain part
    And file sample_D.text content should not contain part
    And file sample_E.text content should match ^(thing|other)$
    And file sample_F.text content should not match ^(thing|other)$
```

If the file does not exist, the test will fail.

### Snapshot testing

Snapshot testing test a response / content against a saved snapshot.
Snapshots are stored in a file with same name as the feature file with the extension `.snap`
in a folder __snapshots__ in the same folder as the feature file.

**:warning: Snapshots files should be versioned to be compared while running tests**

Folder tree should look like : 
support/
features/
  feature_with_snapshot.feature
  feature_without_snapshot.feature
  __snapshots__/
    feature_with_snapshot.feature.snap
  …

In a snapshot file, snapshot name follow the pattern: 
SNAPSHOT_NAME NUMBER_OF_TIME_THIS_NAME_WAS_ENCOUNTERED_IN_CURRENT_FILE.NUMBER_OF_TIME_WE_HAD_A_SNAPSHOT_IN_THIS_SCENARIO.
For example, this would give: Scnenario 1 1.1

If a snapshot doesn't exists, it will be created the first time.

To update snapshot use the cucumber command line option '-u'. If you narrowed the tests with tags, only the snapshots 
related to the tagged scenarios will be updated.

In case you need to remove unused snapshots, you can use the option `--cleanSnapshots`.
:warning: You shouldn't use this option with tags. It may result in used snapshots removed.
:information_source: Snapshot files related to feature files with no snapshots anymore won't get removed. You need to do it manually.

#### API Snapshot testing

In order to check an api response against a snapshot, you have the following gherkin expression available:

```
/^response body should match snapshot$/
```

This example illustrates it:

```gherkin
Scenario: Creating a resource using typed json payload
  Given I set request json body
    | username  | plouc((string))          |
    | team_id   | 1((number))              |
    | is_active | true((boolean))          |
    | hobbies   | drawing,hacking((array)) |
  When I POST https://my-api.io/users
  Then response status code should be 201
  And response body should match snapshot
```

#### CLI Snapshot testing

In order to check a CLI output against a snapshot, you have the following gherkin expression available:

```
/^(stderr|stdout) output should match snapshot$/
```

This example illustrates it:

```gherkin
Scenario: Getting info about installed yarn version
  When I run command yarn --version
  Then exit code should be 0
  And stdout output should match snapshot
  And stderr output should match snapshot
```

#### File Snapshot testing

In order to check a file content against a snapshot, you have the following gherkin expression available:

```
/^file (.+) should match snapshot$/
```

This example illustrates it:

```gherkin
Scenario: Testing file content related expectations
    Then file sample_1.text should match snapshot
```

## Extensions

This module is composed of several extensions.

[state](#state-extension) | [fixtures](#fixtures-extension) | [http API](#http-api-extension) | [CLI](#cli-extension)

### state extension

The state extension is a simple helper used to persist state between steps & eventually scenarios
(but you should try to avoid coupling scenarios).

It's involved for example when [you want to collect values issued by a previous request](#using-values-issued-by-a-previous-request)
when using the [http API extension](#http-api-extension).

#### state installation

To install the extension, you should add the following snippet to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
    })
})

state.install(defineSupportCode)
```

#### State gherkin expressions

```yaml    
Given:
  - /^(?:I )?set state (.+) to (.+)$/

When:
  - /^(?:I )?clear state$/
  - /^(?:I )?dump state$/

Then:
  # No definitions
```

#### State low level API

When installed, you can access it from the global cucumber context in your own step definitions.
For available methods on the state, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_state_State.html).

```javascript
defineSupportCode(({ When }) => {
    When(/^I do something useful$/, function() {
        const stateValue = this.state.get('whatever')
        // …
    })
})
```

### Fixtures extension

The fixtures extension can be used to load data from files during testing.

It supports the following file extensions:

- **.yaml**, **.yml** - loads and parses a yaml file, result can be `Object` or `Array`
- **.txt** - loads text content, result is a `string`
- **.json** - loads json, result is and `Object`
- **.js** - loads a javascript module, the module must exports load function via `module.exports`,
  result can be whatever type the function returns 

#### Fixtures installation

To install the extension, you should add the following snippet to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { fixtures } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        fixtures.extendWorld(this)
    })
})

fixtures.install(defineSupportCode)
```

#### Fixtures low level API

When installed, you can access it from the global cucumber context in your own step definitions.
For available methods on the fixtures loader, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_fixtures_FixturesLoader.html).

```javascript
defineSupportCode(({ When }) => {
    When(/^I do something useful with fixtures$/, function() {
        return this.fixtures.load('whatever')
            .then(fixture => {
                // …
            })
    })
})
```

### http API extension 

#### http API installation 

The http API extension relies on the [state](#state-extension) &
[fixtures](#fixtures-extension) extensions, so make sure they're
registered prior to installation.

To install the extension, you should add the following snippet
to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, fixtures, httpApi } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        httpApi.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install({
    baseUrl: 'http://localhost:3000',
})(defineSupportCode)
```

#### http API gherkin expressions

```yaml    
Given:
  - /^(?:I )?set request headers$/
  - /^(?:I )?do not follow redirect$/
  - /^(?:I )?follow redirect$/
  - /^(?:I )?assign request headers$/
  - /^(?:I )?set ([a-zA-Z0-9-]+) request header to (.+)$/
  - /^(?:I )?clear request headers/
  - /^(?:I )?set request json body$/
  - /^(?:I )?set request json body from (.+)$/
  - /^(?:I )?set request form body$/
  - /^(?:I )?set request form body from (.+)$/
  - /^(?:I )?set request multipart body from (.+)$/
  - /^(?:I )?clear request body$/
  - /^(?:I )?set request query$/
  - /^(?:I )?pick response json (.+) as (.+)$/
  - /^(?:I )?enable cookies$/
  - /^(?:I )?disable cookies$/
  - /^(?:I )?set cookie from (.+)$/
  - /^(?:I )?clear request cookies$/

When:
  - /^(?:I )?reset http client$/
  - /^(?:I )?(GET|POST|PUT|DELETE) (.+)$/
  - /^(?:I )?dump response body$/
  - /^(?:I )?dump response headers$/
  - /^(?:I )?dump response cookies$/

Then:
  - /^response status code should be ([1-5][0-9][0-9])$/
  - /^response status should be (.+)$/
  - /^response should (not )?have an? (.+) cookie$/
  - /^response (.+) cookie should (not )?be secure$/
  - /^response (.+) cookie should (not )?be http only$/
  - /^response (.+) cookie domain should (not )?be (.+)$/
  - /^(?:I )?json response should (fully )?match$/
  - /^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/
  - /^response should match fixture (.+)$/
  - /^response header (.+) should (not )?(equal|contain|match) (.+)$/
```

#### http API low level API

When installed, you can access its client from the global cucumber context in your own step definitions.
For available methods on the client, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_httpApi_client.html).

```javascript
defineSupportCode(({ When }) => {
    When(/^I do something useful$/, function() {
        return this.httpApiClient.makeRequest(/* … */)
    })
})
```

### CLI extension 

#### CLI installation

The CLI extension relies on the [state](#state-extension) &
[fixtures](#fixtures-extension) extensions, so make sure they're
registered prior to installation.

To install the extension, you should add the following snippet
to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, fixtures, cli } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        cli.extendWorld(this)
    })
})

state.install(defineSupportCode)
fixtures.install(defineSupportCode)
cli.install(defineSupportCode)
```

#### CLI gherkin expressions

```yaml    
Given:
  - /^(?:I )?set (?:working directory|cwd) to (.+)$/
  - /^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/
  - /^(?:I )?set (?:env|environment) (?:vars|variables)$/
  - /^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/

When:
  - /^(?:I )?run command (.+)$/
  - /^(?:I )?dump (stderr|stdout)$/

Then:
  - /^(?:the )?(?:command )?exit code should be (\d+)$/
  - /^(stderr|stdout) should be empty$/
  - /^(stderr|stdout) should contain (.+)$/
  - /^(stderr|stdout) should not contain (.+)$/
  - /^(stderr|stdout) should match (.+)$/
  - /^(stderr|stdout) should not match (.+)$/
```

#### CLI low level API

When installed, you can access it from the global cucumber context in your own step definitions.
For available methods on the client, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_Cli_Cli.html).

```javascript
defineSupportCode(({ When }) => {
    Then(/^I check something from the CLI output$/, function() {
        const out = this.cli.getOutput()
        // …
    })
})
```

### File system extension 

#### File system installation

The fileSystem extension relies on the [cli](#cli-extension) extension,
so make sure it's registered prior to installation.

To install the extension, you should add the following snippet
to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, fixtures, cli, fileSystem } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        cli.extendWorld(this)
        fileSystem.extendWorld(this)
    })
})

state.install(defineSupportCode)
fixtures.install(defineSupportCode)
cli.install(defineSupportCode)
fileSystem.install(defineSupportCode)
```

#### File system gherkin expressions

```yaml    
Given:
  - /^(?:I )?create directory (.+)$/
  - /^(?:I )?remove (?:file|directory) (.+)$/

When:
  # No definitions

Then:
  - /^(file|directory) (.+) should (not )?exist$/
  - /^file (.+) content should (not )?(equal|contain|match) (.+)$/
```

#### File system low level API

When installed, you can access it from the global cucumber context in your own step definitions.
For available methods on the fileSystem, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_FileSystem_FileSystem.html).

```javascript
defineSupportCode(({ Then }) => {
    Then(/^I check something using file system$/, function() {
        return this.fileSystem.getFileContent('whatever')
            .then(content => {
                // …    
            })
    })
})
```

### Snapshot extension 

#### Snapshot extension installation

The snapshot extension add capabilities to [api](#http-api-extension), [cli](#cli--extension) and [file](#file-system-extension) extensions,
so you will need these extensions if you want to use snapshot related gherkin definitions.

To install the extension, you should add the following snippet
to your `world` file:

```javascript
// /support/world.js

const { defineSupportCode } = require('cucumber')
const { state, fixtures, cli, fileSystem, snapshot } = require('@ekino/veggies')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        cli.extendWorld(this)
        fileSystem.extendWorld(this)
        snapshot.extendWorld(this)
    })
})

state.install(defineSupportCode)
fixtures.install(defineSupportCode)
cli.install(defineSupportCode)
fileSystem.install(defineSupportCode)
snapshot.install(defineSupportCode)
```

#### Snapshot low level API

When installed, you can access it from the global cucumber context in your own step definitions.
For available methods on the snapshot, please refer to its own
[documentation](https://ekino.github.io/veggies/module-extensions_snapshot_extension.html).

```javascript
defineSupportCode(({ Then }) => {
    Then(/^Some content should match snapshot$/, function() {
        this.snapshot.expectToMatch('whatever')
    })
})
``

## Helpers

### Cast helper

Cast helper can be used to cast values for custom gherkin rules.
To find more about casting see [Type System](#type-system).

#### Cast usage

This must be used on gherkin arrays. Based on your array type you have to use: 
 * ```step.hashes()``` -> ```Cast.objects(step.hashes())```
 * ```step.rows()``` -> ```Cast.array(step.rows())```
 * ```step.raw()``` -> ```Cast.array(step.raw())```
 * ```step.rowsHash()``` -> ```Cast.objects(step.rowsHash())```
 
For example:

```javascript
const { cast } = require('@ekino/veggies')
const { defineSupportCode } = require('cucumber')

defineSupportCode(function({ Given, When, Then }) {
    Then(/^User data should be$/, (step) => {
        const userData = this.userData
        const expectedData = Cast.objects(step.rowsHash())
        expect(userData).to.be.deep.equal(expectedData)
    })
})
```

#### Add a type

You can provide your own type.
For example:

```javascript
Cast.addType('newType', value => value === 'true')
```

Can be used on:
```gherkin
  Given I get user id1 profile
  Then I should receive
    | id              | id1             |
    | age             | 1((number))     |
    | name            | veggies         |
    | isPublic        | true((newType)) |
```


## Examples

This repository comes with few examples, in order to run them, invoke the following script:

```sh
yarn run examples
```

If you want to only run certain examples, you can use tags, for example to run cli extension examples:

```sh
yarn run examples -- --tags @cli
```

There is a special tag which only runs examples not requiring network access:

```sh
yarn run examples -- --tags @offline
```

Due to public API rate limit (eg. GitHub API), this tag is used when running on CI.

[npm-image]: https://img.shields.io/npm/v/@ekino/veggies.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ekino/veggies
[travis-image]: https://img.shields.io/travis/ekino/veggies.svg?style=flat-square
[travis-url]: https://travis-ci.org/ekino/veggies
[prettier-image]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[coverage-image]: https://img.shields.io/coveralls/ekino/veggies/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/ekino/veggies?branch=master

[github-watch-badge]: https://img.shields.io/github/watchers/ekino/veggies.svg?style=social
[github-watch]: https://github.com/ekino/veggies/watchers
[github-star-badge]: https://img.shields.io/github/stars/ekino/veggies.svg?style=social
[github-star]: https://github.com/ekino/veggies/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20veggies!%20https://github.com/ekino/veggies%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/ekino/veggies.svg?style=social
