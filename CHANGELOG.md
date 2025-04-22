# What's changed

## [2.0.1](https://github.com/ekino/veggies/compare/v1.4.0..v2.0.1) - 2025-04-22

### 🚀 Features

- *(esm)* Use arrow function and use world param to replace this keyword - ([76c8d35](https://github.com/ekino/veggies/commit/76c8d35cb1e22e1c250ce65c0c721623a6c44502))
- *(esm)* Support dual package esm-cjs - ([437c688](https://github.com/ekino/veggies/commit/437c688e2159787f63d079ed10befe7dadeeae87))
- *(time)* Remove luxon, write native date time typescript code - ([184a6ae](https://github.com/ekino/veggies/commit/184a6ae4185a3e1c1ad3925a502e0db539e520f3))
- *(typescript)* Convert extensions/http_api to typescript - ([932f8e1](https://github.com/ekino/veggies/commit/932f8e15a53c422fcadd78e9f9905999cd6d7eab))
- *(typescript)* Add missing return type - ([1eb6312](https://github.com/ekino/veggies/commit/1eb6312223c9e6c11501ebfced73711fa7806bb9))
- *(typescript)* Convert extensions/snaphost to typescript - ([924191c](https://github.com/ekino/veggies/commit/924191c2a1567517522be7ece03bf9089454e8fa))
- *(typescript)* Covert extensions/fixtures to typescript - ([d08a5e2](https://github.com/ekino/veggies/commit/d08a5e2645f75c35fc476266bdd8d1d73e52bbe2))
- *(typescript)* Convert extensions/file_system to typescript - ([b11c8e3](https://github.com/ekino/veggies/commit/b11c8e3415646f282356808dea8df48b8078e5b3))
- *(typescript)* Convert src/cli to typescript - ([fb438f2](https://github.com/ekino/veggies/commit/fb438f2bbdb75ac3b282697c1acac291e0907d97))
- *(typescript)* Convert src/state to typescript - ([b3163af](https://github.com/ekino/veggies/commit/b3163aff30e5586b54645b03dde7a825a9b10f19))
- *(typescript)* Convert src/core to typescript - ([09ef87a](https://github.com/ekino/veggies/commit/09ef87a9b79f8d94e48f8c471b1264b97670ddbe))
- *(typescript)* Convert src/index to typescript - ([c4363eb](https://github.com/ekino/veggies/commit/c4363eb2fb4a0fd297826823943c64b419bad8db))
- *(typescript)* Convert utils files to typescript - ([3654dfb](https://github.com/ekino/veggies/commit/3654dfb12ca722897d477eb10bbc6459ef3968a5))
- *(typescript)* Setup tsconfig configurations - ([f1422dd](https://github.com/ekino/veggies/commit/f1422dd8ba9f570f8435f9e35495ad29c8a90816))
- Remove chai, replace by node:assert - ([519f4d5](https://github.com/ekino/veggies/commit/519f4d50ff27fe0a63db92fc98c11bc3068787c4))
- Replace eslint+prettier by biome and fix typings - ([0dc14fe](https://github.com/ekino/veggies/commit/0dc14fe90f5ec8ac87f0c76f6b94c6e6c37d37e4))
- Replace request by axios - ([9c655c3](https://github.com/ekino/veggies/commit/9c655c3359b76ff22e9dbbfe098df912512b3a5c))
- Replace moment-timezone by luxon - ([16b7323](https://github.com/ekino/veggies/commit/16b7323b4c447bdecc91b7f5f8997a3256a5fcd5))

### 🐛 Bug Fixes

- *(assertions)* Allow match undefined value for regex - ([a031087](https://github.com/ekino/veggies/commit/a03108790352d17bb1bef9840cf2922452173b51))
- *(assertions)* Fix type comparison - ([461199d](https://github.com/ekino/veggies/commit/461199d0dd17b923dff60051df576d4617b3f033))
- *(bin)* Filter cucumber args only - ([7354cd2](https://github.com/ekino/veggies/commit/7354cd252cbd1acb3316bdd6796c58aa358c23fe))
- *(cli)* Check correctly null type - ([f5b310b](https://github.com/ekino/veggies/commit/f5b310bce2c1f9a0a94d0861aa1445a886d3ed1b))
- *(esm)* Fix issues common.js for CLI - ([0a7fdf6](https://github.com/ekino/veggies/commit/0a7fdf61278ea51ce15b518d2293b9b43de74fdb))
- *(http_api)* Flexible path join for slash on baseUrl - ([0bc44df](https://github.com/ekino/veggies/commit/0bc44df8fe0d1e2fd5b628aa079ecf1a2bcdfd13))
- *(http_api)* Should return response when axios error - ([082266f](https://github.com/ekino/veggies/commit/082266f4389021ba42bcdbb9c9a4ad2d4c7e20f1))
- *(http_api)* Setup correctly valid status redirect for axios - ([171c1dd](https://github.com/ekino/veggies/commit/171c1dd05c014458ea8c13bbe0d1486c1aa974e8))
- *(http_api)* Fix correct info for axios request - ([5e7d72e](https://github.com/ekino/veggies/commit/5e7d72e9564f2a850a2566d51eb8989d72f38e28))
- *(utils)* Handle correctly base number index for setValue method - ([c601d22](https://github.com/ekino/veggies/commit/c601d22cb8f5c00c7acee8de65086192f26123b9))
- *(utils)* Loose the comparison type for the match rule - ([960adb1](https://github.com/ekino/veggies/commit/960adb1e8524ee013a94d61ec7049983e857d322))
- *(utils)* Check correctly for obj["key"] case - ([98e1ced](https://github.com/ekino/veggies/commit/98e1cedfbc4ac6ae5a377e7bcae735378d778975))
- *(utils)* Fix template, accept escape <key> template - ([760c141](https://github.com/ekino/veggies/commit/760c1414184d5b724a4f8802d17c43a18c6d0838))
- *(utils)* Fix method setValue for array[x] value - ([31e06d2](https://github.com/ekino/veggies/commit/31e06d2c66f5505bd9a6f228a05337626f67621b))
- *(utils)* Fix method getValue - ([ad30a72](https://github.com/ekino/veggies/commit/ad30a720ef56ccbbaeff6175c609da63dde08eae))

### 🚜 Refactor

- *(colors)* Write better for colors utils - ([c0ef364](https://github.com/ekino/veggies/commit/c0ef364e15fa12d94422f3331deb04ed8ffbe252))
- *(core)* Clean assertion message error - ([d7c29dd](https://github.com/ekino/veggies/commit/d7c29ddd0e729b0b57a5f12466864cbc84396d2d))
- *(core)* Make the castFunction more clean - ([16a7fc1](https://github.com/ekino/veggies/commit/16a7fc106a2c396c6ee7061fde4016bab8ce6f92))
- *(extensions)* Keep the code more clean - ([6626f59](https://github.com/ekino/veggies/commit/6626f5938caf7ac842e1fcd4bec225d1c6c3ab5a))
- *(peft)* Replace glob by fast-glob - ([91eb414](https://github.com/ekino/veggies/commit/91eb414932cf3c8868cdda745c151b351b9fe062))
- *(test)* Restructure unit and functional folder tests - ([89acf6b](https://github.com/ekino/veggies/commit/89acf6bcc22a987e878e4ccd8e848ab0dad1c0e1))
- *(utils)* Clean useless typing - ([68dd49a](https://github.com/ekino/veggies/commit/68dd49ae4da6dfeef4408637cfd38d5995f3963d))
- *(utils)* Use name nullish, truthy correctly - ([7c71424](https://github.com/ekino/veggies/commit/7c7142417bf48f2a3f3d808351c8e63f91a6b169))
- Remove chalk and use native ANSI color - ([bf1ac5c](https://github.com/ekino/veggies/commit/bf1ac5c26554e23313bd0e298a175ba85681076d))
- Use only snackcase for file name - ([c076341](https://github.com/ekino/veggies/commit/c076341349b41bf3c4b7b1ca0df1b85aa2f3a4a9))
- Use structuredClone native in nodejs - ([0ebef6b](https://github.com/ekino/veggies/commit/0ebef6b017fdc3f9078cc20751de608fc479ee05))
- Migrate to ESM - ([0bc5abb](https://github.com/ekino/veggies/commit/0bc5abb7aacc03bf907a03faf0d02b1ade38ae3d))
- Remove lodash - ([8fc81df](https://github.com/ekino/veggies/commit/8fc81df9db13f302a9c66ad611dc4973073a7aaf))

### 📚 Documentation

- Rename twitter to x and use https protocol for example - ([2d821f1](https://github.com/ekino/veggies/commit/2d821f1c312e8222d38fa9f2559741b2ad7472ac))
- Update README.md - ([7411124](https://github.com/ekino/veggies/commit/74111243f57e7d30721cf9fa47c240c79481c2e1))

### 🎨 Styling

- Keep original format - ([8221c58](https://github.com/ekino/veggies/commit/8221c58c4150953c01a0b62e1a9142507fd8e3c6))

### 🧪 Testing

- *(core)* Convert test core to typescript and fix code - ([6fd34dd](https://github.com/ekino/veggies/commit/6fd34ddcfb095977af88652f1361c5687cab5ab7))
- *(coverage)* Disabe all options for coverage - ([71e6344](https://github.com/ekino/veggies/commit/71e6344346bba288ed5118d472778f45225b5215))
- *(fixtures)* Convert tests to typescript - ([8695e24](https://github.com/ekino/veggies/commit/8695e24c67f352cda8611cdd0747a57c52e9404c))
- *(func)* Twitter block testing request, replace to wikipedia - ([d116811](https://github.com/ekino/veggies/commit/d116811af51a5995efdbccd7526c1e92db88337c))
- *(func)* Complete test-func for http_api definitions - ([c30c5b0](https://github.com/ekino/veggies/commit/c30c5b0ad856a78a3162faef0908564f48a30289))
- *(http_api)* Convert http_api tests to typescript - ([75431c4](https://github.com/ekino/veggies/commit/75431c4cd7c5c10b96a8cf5a68c3e6f0df7773bf))
- *(snapshot)* Convert tests to typescript - ([6a43e29](https://github.com/ekino/veggies/commit/6a43e29c16839faa05596ee61628cf7151a00f13))
- *(state)* Convert extensions/state tests to typescript - ([1ead586](https://github.com/ekino/veggies/commit/1ead586416dafae28b3e472843fd278d9b4d69d2))
- *(uni)* Simplify throw error message - ([0af995a](https://github.com/ekino/veggies/commit/0af995af789ccf159afef8653710f53689ac26c9))
- *(unit)* Loose string comparison for multiplateform check - ([f96cf09](https://github.com/ekino/veggies/commit/f96cf09df5b8ad89840ff4bf964088567abf6660))
- *(unit)* Replace jest by vitest - ([426a3dc](https://github.com/ekino/veggies/commit/426a3dc81bbf57111800591cde94833a2d89b18a))
- *(unit)* Make all unit tests passe (still use cjs) - ([2d0b5d7](https://github.com/ekino/veggies/commit/2d0b5d712497c6d4b49a422fbf8c090aa6cfb69c))
- *(unit)* Still use cjs for testing extensions/snapshot - ([127fbf6](https://github.com/ekino/veggies/commit/127fbf6eb00352367f7f195a710ba47411e591bd))
- *(unit)* Fix unit tests core - ([b7b9029](https://github.com/ekino/veggies/commit/b7b90293d2ea44e4a3bf6d543567be60d6e391be))
- *(unit)* Fix and add utils tests - ([354a213](https://github.com/ekino/veggies/commit/354a213d1da490df433c089635950dcea1c80090))
- *(utils)* Convert utils test to typescript and fix code - ([7829fbf](https://github.com/ekino/veggies/commit/7829fbfc1912b4dea3c627090c3cc2b701dcfcc8))
- Change http to https on .feature files - ([2d525be](https://github.com/ekino/veggies/commit/2d525be64899903a5543d152a9af3ea8eed6eaf3))
- Replace step definitions unit tests not working in cucumber 10.x by functional tests - ([a5880ac](https://github.com/ekino/veggies/commit/a5880ace965ae58e8590b4adea717122f5030895))

### ⚙️ Miscellaneous Tasks

- *(changlog)* Add cliff changelog configurations - ([46f0fdd](https://github.com/ekino/veggies/commit/46f0fdd93453fea0a1a9d3eaa88bc2f0fd991a15))
- *(docs)* Remove generated docs and gh pages - ([3077485](https://github.com/ekino/veggies/commit/3077485fae6b7e1e13b53faffbd088ae3c4dbb80))
- *(eslint)* Migrate and fix compability for ESLint 9.x - ([7e16100](https://github.com/ekino/veggies/commit/7e161009976caeeb73a0635ef1fe044820371019))
- *(hook)* Replace husky by native feature githooks - ([80f4cf7](https://github.com/ekino/veggies/commit/80f4cf7dd75c31cea1ed4e541f71eccfccb5616f))
- *(lint)* Active rule to check noUnusedTemplateLiteral - ([1f80274](https://github.com/ekino/veggies/commit/1f80274b14fa1ba4c0b38241d3e9acb021bea6f4))
- *(release)* V2.0.1 - ([24d78c3](https://github.com/ekino/veggies/commit/24d78c3c6108fdd7158ce6b42ddcd1c9aa0c2086))
- *(release)* Print bumped version - ([1e49891](https://github.com/ekino/veggies/commit/1e49891963e5d12410820f096cd13c9ee89ee19a))
- *(tsconfig)* Remove allowJs options - ([c8a8f84](https://github.com/ekino/veggies/commit/c8a8f849e66318266f4bcf0c61e2469d5a0c5d35))
- *(tsconfig)* Clean tsconfigs options - ([ede28b6](https://github.com/ekino/veggies/commit/ede28b66c4f043f195d232386b9c636c27a3b49e))
- *(tsconfig)* Set declarationMap true - ([e0be20a](https://github.com/ekino/veggies/commit/e0be20a25d1f62c5534e1b7cc2515c9da9f67e17))
- *(typescript)* Add erasableSyntaxOnly flag to disable typescript only features - ([6168a78](https://github.com/ekino/veggies/commit/6168a7876fc1baef95816a977c0b1b0d81dd9b0d))
- *(typescript)* Centralize types - ([38c4498](https://github.com/ekino/veggies/commit/38c449870a5b6c741bf9bf4d1efa4b73010bbc86))
- Add .nvmrc - ([fdf34c5](https://github.com/ekino/veggies/commit/fdf34c55e143fe9d8f0264212d3ae09bc5292cfe))
- Clean up - ([ae35d08](https://github.com/ekino/veggies/commit/ae35d0869b0cda0634d10ed0230521bb941d5ca9))
- Correct typos - ([b2d895b](https://github.com/ekino/veggies/commit/b2d895b840012984db8ea3692a04df6b1e88ef6e))
- Rename maintainer Ekino to ekino - ([a882aa7](https://github.com/ekino/veggies/commit/a882aa75dcc796311dca29d387142c6a2a0aca07))
- Still support nodejs 18 lts - ([091c159](https://github.com/ekino/veggies/commit/091c159fe1910a7bdb2a157ba9a3e01c7ae5b7c3))
- Add check-typing command - ([356f505](https://github.com/ekino/veggies/commit/356f505ec8d80c8b16b5d987ce5dab10f6522d34))
- Simplify create tag and bump version by using npm - ([e17be7e](https://github.com/ekino/veggies/commit/e17be7edb099d4b3d74886600ee1ee095b00c1ea))
- Fix tests func support files - ([7a7e21f](https://github.com/ekino/veggies/commit/7a7e21f227d3b3c2117003ca7daf1374697fad78))
- Add build steps - ([bf903c4](https://github.com/ekino/veggies/commit/bf903c49bc901f8e1cddd5a0b0651e65043a00ba))
- Move assertions types to types central - ([4770f8b](https://github.com/ekino/veggies/commit/4770f8b6fadeef0ce9070df2a50cf3aa92864d36))
- Fix linters steps - ([831394d](https://github.com/ekino/veggies/commit/831394dd1494aa08e5b30b6d53887447397a961d))
- Remove arg, use node:util, clean bin command - ([f135c81](https://github.com/ekino/veggies/commit/f135c81e3ada96bbb5264a15171d2e4ed3e9f625))
- Setup correctly CI - ([3e91936](https://github.com/ekino/veggies/commit/3e9193669386ff027b0b6feb07f9b9735c49dea4))
- Use pnpm instead of yarn - ([f938423](https://github.com/ekino/veggies/commit/f938423816a36fbdc05a4ff7e0a92c4ebd08945c))
- Add recommended lint rules to common config - ([fb1912b](https://github.com/ekino/veggies/commit/fb1912bccc47b2b3727dd26ac109208d0b3ea2c0))
- Downgrade chai to 4.5, because 5.x support only esm - ([9801967](https://github.com/ekino/veggies/commit/9801967e43618781b93666848927e8dab0a965d3))
- Use test-func command instead of test-cli - ([07b87b0](https://github.com/ekino/veggies/commit/07b87b0cc0046c2a03360f435d949d50173487a9))
- Update yarn 4.3 - ([cda8ded](https://github.com/ekino/veggies/commit/cda8ded34900a64e4c3e78b0f76945d9f258ccaa))

## New Contributors ❤️

* @olivierGuillermEkino made their first contribution in [#96](https://github.com/ekino/veggies/pull/96)
* @tduyng made their first contribution

## 1.4.0 (2022-06-22)

* chore(deps): upgrade cucumber v8 ([163ea41](https://github.com/ekino/veggies/commit/163ea41))
* chore(lint): add linter for json,yaml ([834ca12](https://github.com/ekino/veggies/commit/834ca12))



## 1.3.0 (2022-03-22)

* feat(httpApi): add definition to replace placeholder in key of state ([b2b96c2](https://github.com/ekino/veggies/commit/b2b96c2))



## 1.2.0 (2022-01-28)

* feat(httpApi): minor improve for httpDefinitions and fix uri for makeRequest ([27fabae](https://github.com/ekino/veggies/commit/27fabae))



## <small>1.1.2 (2022-01-14)</small>

* fix(release): fix changelog output to be multiline ([c510aa4](https://github.com/ekino/veggies/commit/c510aa4))
* ci(release): fix release title ([374c36e](https://github.com/ekino/veggies/commit/374c36e))



## <small>1.1.1 (2022-01-14)</small>

* fix(release): fix publish step by configuring npmrc ([7fa350d](https://github.com/ekino/veggies/commit/7fa350d))
* ci(release): add release actions ([838d598](https://github.com/ekino/veggies/commit/838d598))



## 1.1.0 (2021-11-26)

* chore: changelog script should not override previous versions ([8012b47](https://github.com/ekino/veggies/commit/8012b47))
* chore(yarn): update Yarn version ([c3dba4c](https://github.com/ekino/veggies/commit/c3dba4c))
* feat(cucumber): explicit import of the index file for the CLI ([b3ad0e6](https://github.com/ekino/veggies/commit/b3ad0e6))



## 1.0.1 (2021-09-16)

* feat(cliWrapper): wrap the cucumber CLI to keep the use of custom options ([e0fa4f9](https://github.com/ekino/veggies/commit/e0fa4f9))
* fix(snapshot): remove usage of private variable from jest-diff ([d41ca9b](https://github.com/ekino/veggies/commit/d41ca9b))



## 1.0.0 (2021-08-16)

* chore(cucumber): upgrade to latest version ([d778171](https://github.com/ekino/veggies/commit/d778171))
* chore(dependencies): upgrade all dependencies ([3fcbfe8](https://github.com/ekino/veggies/commit/3fcbfe8))
* chore(deps): upgrade deps to up-to-date versions and yarn to 2.4.O ([c7e94d2](https://github.com/ekino/veggies/commit/c7e94d2))
* chore(node): now supports Node 12 at least and add tests on Node 16 ([179dbed](https://github.com/ekino/veggies/commit/179dbed))
* chore(v1.0.0): bump version to 1.0.0 ([f1a3c50](https://github.com/ekino/veggies/commit/f1a3c50))
* ci(build): check readme has been generated ([0b4fa7d](https://github.com/ekino/veggies/commit/0b4fa7d))
* docs(contributing): add readme update instructions ([da16497](https://github.com/ekino/veggies/commit/da16497))
* feat(http_api): allow patch method ([a6b3423](https://github.com/ekino/veggies/commit/a6b3423))
* feat(http): allow headers with underscores ([c91ef51](https://github.com/ekino/veggies/commit/c91ef51))
* feat(httpApi): add startWith, endWith matchers as well as concise matcher expressions ([0619cad](https://github.com/ekino/veggies/commit/0619cad))
* feat(snapshots): add a flag to prevent snapshots creation ([4e64869](https://github.com/ekino/veggies/commit/4e64869))
* fix(snapshot): ignore color tags when looking for the no diff message ([c482124](https://github.com/ekino/veggies/commit/c482124))



## 0.8.0 (2020-08-21)

* chore(ci): move github actions to the right folder ([b02af56](https://github.com/ekino/veggies/commit/b02af56))
* chore(deps): bump conventional-commit to v9.x ([439a788](https://github.com/ekino/veggies/commit/439a788))
* chore(deps): upgrade deps to up-to-date versions, BREAKING CHANGE: Must use Node.js 10+ ([4d385e7](https://github.com/ekino/veggies/commit/4d385e7))
* chore(release): change way we get current version when releasing ([62ad976](https://github.com/ekino/veggies/commit/62ad976))
* chore(v0.7.2): bump version to 0.7.2 ([79b23df](https://github.com/ekino/veggies/commit/79b23df))
* chore(v0.8.0): bump version to 0.8.0 ([d6953b3](https://github.com/ekino/veggies/commit/d6953b3))
* chore(yarn): migrate to yarn 2 ([b02b498](https://github.com/ekino/veggies/commit/b02b498))
* docs(readme): update ci badge ([a17ca78](https://github.com/ekino/veggies/commit/a17ca78))
* Create ci.yml ([311f4d1](https://github.com/ekino/veggies/commit/311f4d1))



## <small>0.7.1 (2020-07-31)</small>

* chore(deps): bump acorn from 5.7.3 to 5.7.4 ([ea7b377](https://github.com/ekino/veggies/commit/ea7b377))
* chore(deps): bump lodash from 4.17.15 to 4.17.19 ([9812edc](https://github.com/ekino/veggies/commit/9812edc))
* chore(v0.7.1): bump version to 0.7.1 ([a572112](https://github.com/ekino/veggies/commit/a572112))
* feat(packaging): remove useless files from npm package ([5a6d52b](https://github.com/ekino/veggies/commit/5a6d52b))



## 0.7.0 (2019-12-18)

* chore: update dependencies ([23f5d3b](https://github.com/ekino/veggies/commit/23f5d3b))
* chore(dep): Update dependencies and minimal node version to 8 BREAKING ([445c078](https://github.com/ekino/veggies/commit/445c078))
* chore(doc): fix doc ([fc04b74](https://github.com/ekino/veggies/commit/fc04b74))
* chore(doc): fix snapshot doc ([cb5247c](https://github.com/ekino/veggies/commit/cb5247c))
* chore(v0.7.0): bump version to 0.7.0 ([4ebc634](https://github.com/ekino/veggies/commit/4ebc634))
* feat: move to cucumber js 4 / 5 ([1fb34c6](https://github.com/ekino/veggies/commit/1fb34c6))
* feat(assertions): add support for json matchers negation ([1917ecf](https://github.com/ekino/veggies/commit/1917ecf))
* feat(assertions): expose function to assert date with formatting ([bdbe7a4](https://github.com/ekino/veggies/commit/bdbe7a4))
* feat(assertions): expose function to assert objects match spec ([cc0694e](https://github.com/ekino/veggies/commit/cc0694e))
* feat(changelog): Remove git-changelog and use conventional-changelog ([851ba18](https://github.com/ekino/veggies/commit/851ba18))
* feat(definitions): Assign request headers, keeping the previous ones ([da468f7](https://github.com/ekino/veggies/commit/da468f7))
* feat(followRedirect): add followRedirect option for request ([f968b3b](https://github.com/ekino/veggies/commit/f968b3b))
* feat(http-api): accept a body for DELETE request ([febc947](https://github.com/ekino/veggies/commit/febc947))
* feat(http-api): handle null and undefined value for negation flag in definitions ([732fb92](https://github.com/ekino/veggies/commit/732fb92))
* feat(http): add multipart support ([9158874](https://github.com/ekino/veggies/commit/9158874))
* feat(packaging): remove useless files from npm package ([6c94b39](https://github.com/ekino/veggies/commit/6c94b39))
* feat(snapthot): add snapshot property matchers ([54d75e1](https://github.com/ekino/veggies/commit/54d75e1))
* fix(http-api): fix http api extension step definitions ([a353710](https://github.com/ekino/veggies/commit/a353710))
* fix(snapshot): correct snapshot comparison with carriage returns ([74f92fb](https://github.com/ekino/veggies/commit/74f92fb))



## 0.6.0 (2017-10-09)

* chore(v0.6.0): bump version to 0.6.0 ([188e316](https://github.com/ekino/veggies/commit/188e316))
* feat(global): Isolate extensions and make it compatible with cumcumber 3 ([b4d24c6](https://github.com/ekino/veggies/commit/b4d24c6))
* feat(snapshot): Add snapshot extension ([f85fdc8](https://github.com/ekino/veggies/commit/f85fdc8))
* fix(readMe): fix status code verification step in readme ([de8327d](https://github.com/ekino/veggies/commit/de8327d))



## 0.5.0 (2017-07-19)

* chore(contribute): add CONTRIBUTING.md ([197ed78](https://github.com/ekino/veggies/commit/197ed78))
* chore(social): add social badges ([b5ec869](https://github.com/ekino/veggies/commit/b5ec869))
* chore(typo): fix typo for API response headers definition ([623ba3d](https://github.com/ekino/veggies/commit/623ba3d))
* chore(typo): fix typo for json response full match ([d0bf516](https://github.com/ekino/veggies/commit/d0bf516))
* chore(v0.5.0): bump version to 0.5.0 ([365a81b](https://github.com/ekino/veggies/commit/365a81b))
* docs(file-system): fix link ([2df4c72](https://github.com/ekino/veggies/commit/2df4c72))
* docs(file-system): Init fileSystem documentation ([2897d17](https://github.com/ekino/veggies/commit/2897d17))
* docs(file-system): Update fileSystem extension's gherkin expressions ([0e965fc](https://github.com/ekino/veggies/commit/0e965fc))
* docs(http-api): add doc about debugging API tests ([add6414](https://github.com/ekino/veggies/commit/add6414))
* docs(http-api): add doc about testing response headers ([4a44082](https://github.com/ekino/veggies/commit/4a44082))
* docs(requirements): add requirements doc ([a8adc2d](https://github.com/ekino/veggies/commit/a8adc2d))
* test(file-system): add tests on file system extension ([4847a46](https://github.com/ekino/veggies/commit/4847a46))
* feat(cast): expose cast helper and support custom types ([ead72dd](https://github.com/ekino/veggies/commit/ead72dd))
* feat(dx): add git hooks ([fa2ab07](https://github.com/ekino/veggies/commit/fa2ab07))
* feat(dx): run eslint on precommit ([1813533](https://github.com/ekino/veggies/commit/1813533))
* feat(dx): run examples on feature file change ([8d7c072](https://github.com/ekino/veggies/commit/8d7c072))
* feat(dx): run tests related to modified files on precommit ([41303e3](https://github.com/ekino/veggies/commit/41303e3))
* feat(dx): validate commit message ([c624c06](https://github.com/ekino/veggies/commit/c624c06))
* feat(examples): update cookies example ([b1139a9](https://github.com/ekino/veggies/commit/b1139a9))
* feat(file-system): add ability to create directories ([0b176bb](https://github.com/ekino/veggies/commit/0b176bb))
* feat(file-system): add ability to remove files or directories ([eb82ed7](https://github.com/ekino/veggies/commit/eb82ed7))
* feat(file-system): add ability to test file|directory presence ([acba1a9](https://github.com/ekino/veggies/commit/acba1a9))
* feat(file-system): Init fileSystem extension ([2ca79cd](https://github.com/ekino/veggies/commit/2ca79cd))
* doc(readme): add doc about offline examples ([31e43be](https://github.com/ekino/veggies/commit/31e43be))



## 0.4.0 (2017-07-08)

* chore(v0.4.0): bump version to 0.4.0 ([3ccb219](https://github.com/ekino/veggies/commit/3ccb219))
* feat(cookies): add ability to clear request cookies ([1c8fa85](https://github.com/ekino/veggies/commit/1c8fa85))
* feat(cookies): add ability to dump cookies ([7a67819](https://github.com/ekino/veggies/commit/7a67819))
* feat(cookies): add ability to set cookie ([23d8924](https://github.com/ekino/veggies/commit/23d8924))
* feat(http-api): improve json response assertion ([eaca04b](https://github.com/ekino/veggies/commit/eaca04b))



## 0.3.0 (2017-07-05)

* chore(editorconfig): add .editorconfig ([caa3acc](https://github.com/ekino/veggies/commit/caa3acc))
* chore(github): add GitHub issue PR templates ([c247c23](https://github.com/ekino/veggies/commit/c247c23))
* chore(identity): add custom banner ([fc9d89e](https://github.com/ekino/veggies/commit/fc9d89e))
* chore(identity): add custom banner ([d275fb2](https://github.com/ekino/veggies/commit/d275fb2))
* chore(identity): update banner ([df3ffee](https://github.com/ekino/veggies/commit/df3ffee))
* chore(identity): update banner ([11d270b](https://github.com/ekino/veggies/commit/11d270b))
* chore(package): update .npmignore ([e0c116c](https://github.com/ekino/veggies/commit/e0c116c))
* chore(v0.2.0): bump version to 0.2.0 ([f079775](https://github.com/ekino/veggies/commit/f079775))
* chore(v0.3.0): bump version to 0.3.0 ([8ddfd36](https://github.com/ekino/veggies/commit/8ddfd36))
* chore(v2.0.0): bump version to 2.0.0 ([5575b2f](https://github.com/ekino/veggies/commit/5575b2f))
* docs(cli): fix wrong link for CLI extension jsdoc ([c4571c7](https://github.com/ekino/veggies/commit/c4571c7))
* docs(cookies): add documentation on how to enable cookies support ([c0f23f3](https://github.com/ekino/veggies/commit/c0f23f3))
* docs(extensions): improve extensions installation documentation ([5f5ea08](https://github.com/ekino/veggies/commit/5f5ea08))
* docs(fixtures): add missing fixtures extension installation code ([2be5717](https://github.com/ekino/veggies/commit/2be5717))
* docs(http-api): update README for http API updated step definition ([38615d4](https://github.com/ekino/veggies/commit/38615d4))
* docs(readme): update README ([496b701](https://github.com/ekino/veggies/commit/496b701))
* feat(checkResponse): add 'deepEqual' comparison for array when checking response ([6986f91](https://github.com/ekino/veggies/commit/6986f91))
* feat(cookies): assert cookie domain equals/doesn't equal value ([32744e6](https://github.com/ekino/veggies/commit/32744e6))
* feat(cookies): assert cookie is present/absent ([e02510b](https://github.com/ekino/veggies/commit/e02510b))
* feat(cookies): assert cookie is/isn't http only ([c36c637](https://github.com/ekino/veggies/commit/c36c637))
* feat(cookies): assert cookie is/isn't secure ([22ace59](https://github.com/ekino/veggies/commit/22ace59))
* feat(cookies): disable tough-cookie rejectPublicSuffixes ([484c856](https://github.com/ekino/veggies/commit/484c856))
* feat(cookies): improve cookies support for http API extension ([2bd5bca](https://github.com/ekino/veggies/commit/2bd5bca))
* feat(cookies): init cookies support for http API extension ([f7f8caf](https://github.com/ekino/veggies/commit/f7f8caf))
* feat(cookies): update http API extension cookies example ([f416285](https://github.com/ekino/veggies/commit/f416285))
* feat(countNestedProperties): Handle null array when counting object properties ([706011f](https://github.com/ekino/veggies/commit/706011f))
* feat(examples): only run offline examples on CI ([e5835a9](https://github.com/ekino/veggies/commit/e5835a9))
* feat(fixtures): add support for javascript fixtures ([403e377](https://github.com/ekino/veggies/commit/403e377))
* feat(fixtures): add support for JSON fixtures ([aa9b9f5](https://github.com/ekino/veggies/commit/aa9b9f5))
* feat(fixtures): add support for text & yaml fixtures ([1965e37](https://github.com/ekino/veggies/commit/1965e37))
* feat(fixtures): init fixtures support ([db0c460](https://github.com/ekino/veggies/commit/db0c460))
* feat(http-api): add ability to check status code by message ([e89aac6](https://github.com/ekino/veggies/commit/e89aac6))
* feat(http-api): add ability to set body from fixtures ([b4760cc](https://github.com/ekino/veggies/commit/b4760cc))
* feat(http-api): fix http API step definition ([27ee982](https://github.com/ekino/veggies/commit/27ee982))
* feat(http-api): improve fixtures examples ([f84ca4b](https://github.com/ekino/veggies/commit/f84ca4b))
* feat(state): use state for check response step definition ([a3b734b](https://github.com/ekino/veggies/commit/a3b734b))
* feat(stepDef): improve step for getting root object ([91b894b](https://github.com/ekino/veggies/commit/91b894b))
* fix(examples): update stale http API step definition ([e04cb19](https://github.com/ekino/veggies/commit/e04cb19))
* fix(format): add missing formatting ([c367e27](https://github.com/ekino/veggies/commit/c367e27))
* fix(http_api): fix http API definitions test ([33db40e](https://github.com/ekino/veggies/commit/33db40e))
* test(cast): add missing tests on Cast helper ([8956e0d](https://github.com/ekino/veggies/commit/8956e0d))
* test(definitions): add unit tests on extensions definitions ([e33ca13](https://github.com/ekino/veggies/commit/e33ca13))
* test(definitions): improve extensions' definitions tests ([8cab585](https://github.com/ekino/veggies/commit/8cab585))
* test(definitions): improve unit tests on extensions definitions ([e998cfc](https://github.com/ekino/veggies/commit/e998cfc))
* test(fixtures): add tests for FixturesLoader ([56b5d32](https://github.com/ekino/veggies/commit/56b5d32))
* Document extensions gherkin expressions (#6) ([3738972](https://github.com/ekino/veggies/commit/3738972)), closes [#6](https://github.com/ekino/veggies/issues/6)



## <small>0.1.2 (2017-06-29)</small>

* chore(doc): add ability to generate & publish jsdoc ([1b27522](https://github.com/ekino/veggies/commit/1b27522))
* chore(format): add prettier formatting ([d837fe2](https://github.com/ekino/veggies/commit/d837fe2))
* chore(init): init repo ([0957cc6](https://github.com/ekino/veggies/commit/0957cc6))
* chore(release): add commands to ease releasing ([ecd7c43](https://github.com/ekino/veggies/commit/ecd7c43))
* chore(v0.1.1): bump version to 0.1.1 ([dbd4fd8](https://github.com/ekino/veggies/commit/dbd4fd8))
* chore(v0.1.2): bump version to 0.1.2 ([3b0b88a](https://github.com/ekino/veggies/commit/3b0b88a))
* fix(format): add missing formatting ([1868ed2](https://github.com/ekino/veggies/commit/1868ed2))
* fix(lint): fix linting ([3ee554a](https://github.com/ekino/veggies/commit/3ee554a))
* fix(pkg-name): add ekino scope to package name ([05cc5d0](https://github.com/ekino/veggies/commit/05cc5d0))
* fix(readme): fix coverage badge ([79fd0dd](https://github.com/ekino/veggies/commit/79fd0dd))
* fix(readme): fix travis badge ([6c478d6](https://github.com/ekino/veggies/commit/6c478d6))
* test(cast): add unit tests on cast helper ([a2c3f8f](https://github.com/ekino/veggies/commit/a2c3f8f))
* test(cli): test cli examples on CI ([0445a0e](https://github.com/ekino/veggies/commit/0445a0e))
* test(init): init tests ([493342b](https://github.com/ekino/veggies/commit/493342b))
* feat(cli): add ability to dump stdout|stderr ([6a2708c](https://github.com/ekino/veggies/commit/6a2708c))
* feat(cli): init CLI extension ([42430f2](https://github.com/ekino/veggies/commit/42430f2))
* feat(collect): add ability to inject previously collected values ([b72de09](https://github.com/ekino/veggies/commit/b72de09))
* feat(examples): add example with data collection/injection and scenario outline ([f895b73](https://github.com/ekino/veggies/commit/f895b73))
* feat(examples): add example with data collection/injection and scenario outline ([ac43aa1](https://github.com/ekino/veggies/commit/ac43aa1))
* feat(examples): run example on CI ([e793280](https://github.com/ekino/veggies/commit/e793280))
* fix ([262fdde](https://github.com/ekino/veggies/commit/262fdde))
* docs(cli): improve CLI extension documentation ([6257454](https://github.com/ekino/veggies/commit/6257454))
* docs(collect): document data collection & reuse ([0adbd66](https://github.com/ekino/veggies/commit/0adbd66))
* docs(definitions): add link to http_api definitions file ([5201736](https://github.com/ekino/veggies/commit/5201736))
* docs(example): add simple example ([23c490e](https://github.com/ekino/veggies/commit/23c490e))
* docs(examples): add documentation about provided examples ([74f47d0](https://github.com/ekino/veggies/commit/74f47d0))
* docs(examples): update documentation about provided examples ([c25f4d7](https://github.com/ekino/veggies/commit/c25f4d7))
* docs(extensions): init documentation on extensions internals ([9bfba8e](https://github.com/ekino/veggies/commit/9bfba8e))
* docs(index): add links to technical documentation ([0e7c5c5](https://github.com/ekino/veggies/commit/0e7c5c5))
* docs(index): update links according to repository transfer ([843d072](https://github.com/ekino/veggies/commit/843d072))
* docs(init): init documentation ([15e0d30](https://github.com/ekino/veggies/commit/15e0d30))
* docs(post): add documentation about posting data ([fe2625e](https://github.com/ekino/veggies/commit/fe2625e))
* docs(toc): improve README TOC ([b8c11c9](https://github.com/ekino/veggies/commit/b8c11c9))
* docs(type system): add documentation about type system ([e854a25](https://github.com/ekino/veggies/commit/e854a25))
