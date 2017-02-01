/*
 * Copyright 2017 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
;
import getRandomBins from '../../src'
const randombins = getRandomBins({ size: 8 }) // default length is 256 bins

import debug = require('debug')
debug.enable('randombins:*')

const alphabets = [ '0123', 'abcd', 'ABCD' ] // 4*4*4 = 64 combinations

randombins(alphabets)
.forEach(debug('randombins:')) // e.g. 0aA, 0aC, 1aA, 1cB, 2bA, 2bD, 3aA, 3dA
.catch(debug('randombins:error:'))
