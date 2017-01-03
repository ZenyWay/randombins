/*
 * Copyright 2016 Stephane M. Catala
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
const log = debug('randombins')

const alphabets = [ '0123', 'abcd', 'ABCD' ] // 4*4*4 = 64 combinations

randombins(alphabets)
.then(log) // the first combination from the given alphabets,
// together with 7 other randomly selected combinations, in random order
// e.g. [ "3bA", "1cA", "0bA", "0dD", "2aA", "3dC", "0aA", "2cA" ]
