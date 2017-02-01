# randombins [![Join the chat at https://gitter.im/ZenyWay/randombins](https://badges.gitter.im/ZenyWay/randombins.svg)](https://gitter.im/ZenyWay/randombins?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM](https://nodei.co/npm/randombins.png?compact=true)](https://nodei.co/npm/randombins/)
[![build status](https://travis-ci.org/ZenyWay/randombins.svg?branch=master)](https://travis-ci.org/ZenyWay/randombins)
[![coverage status](https://coveralls.io/repos/github/ZenyWay/randombins/badge.svg?branch=master)](https://coveralls.io/github/ZenyWay/randombins)
[![Dependency Status](https://gemnasium.com/badges/github.com/ZenyWay/randombins.svg)](https://gemnasium.com/github.com/ZenyWay/randombins)

generate cryptographically-secure random shuffled bins of string combinations.

# <a name="example"></a> example
```ts
import getRandomBins from 'randombins'
const randombins = getRandomBins({ size: 8 }) // default length is 256 bins

import debug = require('debug')
debug.enable('randombins:*')

const alphabets = [ '0123', 'abcd', 'ABCD' ] // 4*4*4 = 64 combinations

randombins(alphabets)
.forEach(debug('randombins:')) // e.g. 0aA, 0aC, 1aA, 1cB, 2bA, 2bD, 3aA, 3dA
.catch(debug('randombins:error:'))
```

a live version of this example can be viewed [here](https://cdn.rawgit.com/ZenyWay/randombins/v2.0.0/spec/example/index.html)
in the browser console,
or by cloning this repository and running the following commands from a terminal:
```bash
npm install
npm run example
```
the files of this example are available [here](./spec/example).

# <a name="api"></a> API v2.0 stable
`ES5` and [`Typescript`](http://www.typescriptlang.org/) compatible.
coded in `Typescript 2`, transpiled to `ES5`.

for a detailed specification of the API,
run the [unit tests](https://cdn.rawgit.com/ZenyWay/randombins/v2.0.0/spec/web/index.html)
in your browser.

# <a name="contributing"></a> CONTRIBUTING
see the [contribution guidelines](./CONTRIBUTING.md)

# <a name="license"></a> LICENSE
Copyright 2017 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
