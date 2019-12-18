## 0.7.0 (2019-12-18)


### Features

* **assertions:** add support for json matchers negation ([1917ecf](https://github.com/ekino/veggies/commit/1917ecfa5874244eee32b6d463027dde82fc67c0))
* **assertions:** expose function to assert date with formatting ([bdbe7a4](https://github.com/ekino/veggies/commit/bdbe7a4c8e14a0e76d37f055aae1d18b8e929408))
* **assertions:** expose function to assert objects match spec ([cc0694e](https://github.com/ekino/veggies/commit/cc0694ee0947ba049bc6df717f76422203a1bcf3))
* **changelog:** Remove git-changelog and use conventional-changelog ([851ba18](https://github.com/ekino/veggies/commit/851ba18ae9321aa760a945411f340a5a2a4aee09))
* **definitions:** Assign request headers, keeping the previous ones ([da468f7](https://github.com/ekino/veggies/commit/da468f7d948cac4190395af6a447b015caa1462a))
* **followRedirect:** add followRedirect option for request ([f968b3b](https://github.com/ekino/veggies/commit/f968b3ba6ed57ba9e260b85d05426de7bf3eba5f))
* **http:** add multipart support ([9158874](https://github.com/ekino/veggies/commit/9158874a0f631913773d5971162a6ffff40f3ff8))
* **http-api:** accept a body for DELETE request ([febc947](https://github.com/ekino/veggies/commit/febc94727d9b2278960f8c8cb004ab48a760e5d4))
* **http-api:** handle null and undefined value for negation flag in definitions ([732fb92](https://github.com/ekino/veggies/commit/732fb9232c4608a9006bcfe56149b626d945a425))
* **packaging:** remove useless files from npm package ([6c94b39](https://github.com/ekino/veggies/commit/6c94b399e5e083c7e95d0508a16de41a209857e2))
* **snapthot:** add snapshot property matchers ([54d75e1](https://github.com/ekino/veggies/commit/54d75e129d3bdf93087d1aaa6719b11ad93b6890))
* move to cucumber js 4 / 5 ([1fb34c6](https://github.com/ekino/veggies/commit/1fb34c615a4906d6351e19bc0cd32a5ddd988756))


### Bug Fixes

* **http-api:** fix http api extension step definitions ([a353710](https://github.com/ekino/veggies/commit/a35371095fd643bac75baa9fc2cb87f4cf6df72b))
* **snapshot:** correct snapshot comparison with carriage returns ([74f92fb](https://github.com/ekino/veggies/commit/74f92fb96f36b4ecb03b966ba0f8d2cdf3568e39))

## 0.6.0 (2017-10-09)


### Features

* **global:** Isolate extensions and make it compatible with cumcumber 3 ([b4d24c6](https://github.com/ekino/veggies/commit/b4d24c6beb35dc30a57b1f2ccdde016de72a0f12))
* **snapshot:** Add snapshot extension ([f85fdc8](https://github.com/ekino/veggies/commit/f85fdc845348fa320aa857c0835878a8b7630d61))


### Bug Fixes

* **readMe:** fix status code verification step in readme ([de8327d](https://github.com/ekino/veggies/commit/de8327d7d7ae5462fa19da98e31040458aee3da8))

## 0.5.0 (2017-07-19)


### Features

* **cast:** expose cast helper and support custom types ([ead72dd](https://github.com/ekino/veggies/commit/ead72dd72baa6ffe905d0ac8826c4ebd5e00efcd))
* **dx:** add git hooks ([fa2ab07](https://github.com/ekino/veggies/commit/fa2ab07fb01fdc953d50573bf19fdfbe2edbc02c))
* **dx:** run eslint on precommit ([1813533](https://github.com/ekino/veggies/commit/1813533f2b21df433f2aa654b10634b3ff810bbd))
* **dx:** run examples on feature file change ([8d7c072](https://github.com/ekino/veggies/commit/8d7c072d8d2167721d5f201d61a5d7f9a3cc7696))
* **dx:** run tests related to modified files on precommit ([41303e3](https://github.com/ekino/veggies/commit/41303e35bad6f433504c61c9f29a9679f1d33a04))
* **dx:** validate commit message ([c624c06](https://github.com/ekino/veggies/commit/c624c06391de9eb5dfcb6f795a60d6f891736314))
* **examples:** update cookies example ([b1139a9](https://github.com/ekino/veggies/commit/b1139a90d5f8e50a738f4060646f2289345ba669))
* **file-system:** add ability to create directories ([0b176bb](https://github.com/ekino/veggies/commit/0b176bb9ef3190509000dc693e06ae254d651d35))
* **file-system:** add ability to remove files or directories ([eb82ed7](https://github.com/ekino/veggies/commit/eb82ed7da12619a0cc64ceb5c248f128e096d1bf))
* **file-system:** add ability to test file|directory presence ([acba1a9](https://github.com/ekino/veggies/commit/acba1a912d3bc188e91c559ec9f0629b869c472a))
* **file-system:** Init fileSystem extension ([2ca79cd](https://github.com/ekino/veggies/commit/2ca79cddf9ca4f520597a00ee57408b32f85101d))

## 0.4.0 (2017-07-08)


### Features

* **cookies:** add ability to clear request cookies ([1c8fa85](https://github.com/ekino/veggies/commit/1c8fa858a18b66fdb812339d4998becc36473d52))
* **cookies:** add ability to dump cookies ([7a67819](https://github.com/ekino/veggies/commit/7a67819f332ac1623b0be2d478b2c174fb59f5d3))
* **cookies:** add ability to set cookie ([23d8924](https://github.com/ekino/veggies/commit/23d8924862662bcf54d1206bf0ffe6692142d03f))
* **http-api:** improve json response assertion ([eaca04b](https://github.com/ekino/veggies/commit/eaca04b496833b8d02e11fb2af9c83d2b17060dd))

## 0.3.0 (2017-07-05)


### Features

* **checkResponse:** add 'deepEqual' comparison for array when checking response ([6986f91](https://github.com/ekino/veggies/commit/6986f9146dbd36a1f3f4fb426e736d8ffd1fbdcc))
* **cookies:** assert cookie domain equals/doesn't equal value ([32744e6](https://github.com/ekino/veggies/commit/32744e668cdf13499934f8a4028843e863888bac))
* **cookies:** assert cookie is present/absent ([e02510b](https://github.com/ekino/veggies/commit/e02510b35da6786a12386fb8d043fea354fc9c1f))
* **cookies:** assert cookie is/isn't http only ([c36c637](https://github.com/ekino/veggies/commit/c36c637dd9026d290552ff0bf98da246709b21f7))
* **cookies:** assert cookie is/isn't secure ([22ace59](https://github.com/ekino/veggies/commit/22ace59cb514a24d2c7af104125ceddd15de989e))
* **cookies:** disable tough-cookie rejectPublicSuffixes ([484c856](https://github.com/ekino/veggies/commit/484c8566459b8e3efc48b918cd72b66a96a70203))
* **cookies:** improve cookies support for http API extension ([2bd5bca](https://github.com/ekino/veggies/commit/2bd5bcae5d43bf6332c9d24bee1b3734a977287b))
* **cookies:** init cookies support for http API extension ([f7f8caf](https://github.com/ekino/veggies/commit/f7f8caf835c20ce2a484dbdd80c82ee71b7a5fd5))
* **cookies:** update http API extension cookies example ([f416285](https://github.com/ekino/veggies/commit/f416285983b95299786001e2148e7d0495a20bd0))
* **countNestedProperties:** Handle null array when counting object properties ([706011f](https://github.com/ekino/veggies/commit/706011f28edb89ec52f909887391a07d6c2af75c))
* **examples:** only run offline examples on CI ([e5835a9](https://github.com/ekino/veggies/commit/e5835a92dba93366df3455292b42442e873d5618))
* **fixtures:** add support for javascript fixtures ([403e377](https://github.com/ekino/veggies/commit/403e377dd5ff161c9059da8a57d84b77950ed4fb))
* **fixtures:** add support for JSON fixtures ([aa9b9f5](https://github.com/ekino/veggies/commit/aa9b9f5566b6fae3a6d0ac0cdf27f22a1bec05b9))
* **fixtures:** add support for text & yaml fixtures ([1965e37](https://github.com/ekino/veggies/commit/1965e37dbd1f837f3c2e0aa3aaabd72dbfc32439))
* **fixtures:** init fixtures support ([db0c460](https://github.com/ekino/veggies/commit/db0c46038589ad40498bf1cc3f09a690d2fe3b6b))
* **http-api:** add ability to check status code by message ([e89aac6](https://github.com/ekino/veggies/commit/e89aac65e481c4eacccf8628dd317a25bf482aee))
* **http-api:** add ability to set body from fixtures ([b4760cc](https://github.com/ekino/veggies/commit/b4760cc273f53c203a3062054196b10d3d83ac8f))
* **http-api:** fix http API step definition ([27ee982](https://github.com/ekino/veggies/commit/27ee98284954936b3625020ba8c01ac282d2ce4a))
* **http-api:** improve fixtures examples ([f84ca4b](https://github.com/ekino/veggies/commit/f84ca4b296f30769742dc38880e8614a2a2b3c4e))
* **state:** use state for check response step definition ([a3b734b](https://github.com/ekino/veggies/commit/a3b734b7186358692b449e13ba5413eef25e8799))
* **stepDef:** improve step for getting root object ([91b894b](https://github.com/ekino/veggies/commit/91b894b0f033b00503c2f57b5728a475b6fdd0e5))


### Bug Fixes

* **examples:** update stale http API step definition ([e04cb19](https://github.com/ekino/veggies/commit/e04cb19c57824c24dfa7a59009fe1851e84f6a81))
* **format:** add missing formatting ([c367e27](https://github.com/ekino/veggies/commit/c367e2722ed86d22f22e0f6fecdf6cdaabd73972))
* **http_api:** fix http API definitions test ([33db40e](https://github.com/ekino/veggies/commit/33db40e76778b19c458fd54cd676ceba46b03375))

### 0.1.2 (2017-06-29)


### Features

* **cli:** add ability to dump stdout|stderr ([6a2708c](https://github.com/ekino/veggies/commit/6a2708cb911834aa77775ed9ae249a5b77c4dedb))
* **cli:** init CLI extension ([42430f2](https://github.com/ekino/veggies/commit/42430f26230519babd791aa8c82af30c3205e1ce))
* **collect:** add ability to inject previously collected values ([b72de09](https://github.com/ekino/veggies/commit/b72de098ed351564f15d699d1fcffe3608750fff))
* **examples:** add example with data collection/injection and scenario outline ([f895b73](https://github.com/ekino/veggies/commit/f895b733401a1879303adcc25b64db6d2ea4b58a))
* **examples:** add example with data collection/injection and scenario outline ([ac43aa1](https://github.com/ekino/veggies/commit/ac43aa14f2799720cc9a29a52b937a454bfcd7d1))
* **examples:** run example on CI ([e793280](https://github.com/ekino/veggies/commit/e793280ff9cca2e76d0aaf87b5410bc8dba4038d))


### Bug Fixes

* **format:** add missing formatting ([1868ed2](https://github.com/ekino/veggies/commit/1868ed27673b30cd15d664df41e67cb7da36fcf1))
* **lint:** fix linting ([3ee554a](https://github.com/ekino/veggies/commit/3ee554a0977fa6802cead1ba551c67c6a99ee1d3))
* **pkg-name:** add ekino scope to package name ([05cc5d0](https://github.com/ekino/veggies/commit/05cc5d0d620f2ec8a1ef2812da686c0bccb3eb2a))
* **readme:** fix coverage badge ([79fd0dd](https://github.com/ekino/veggies/commit/79fd0ddd9fc00435d0248afd1298c0152ab8487c))
* **readme:** fix travis badge ([6c478d6](https://github.com/ekino/veggies/commit/6c478d6ea641c2ac6a724d17e5de01657190cbe7))

