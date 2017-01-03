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
import randomSizeBins from './random-size-bins'
import toCombination$ from 'ordered-char-combinations'
import getRandomWords from 'randomwords'
import getRandomShuffle from 'randomshuffle'
import { Stream, from as toStream, throwError } from 'most'

export interface RandomBinsFactorySpec {
  size: number
  toCombination$: (alphabets: string[]|Stream<string>) => Stream<string>
  randomwords: (length: number) => Uint16Array
  randomshuffle: <T>(arr: T[]) => T[]
}

export default function (opts?: Partial<RandomBinsFactorySpec>) {
  const spec = getRandomBinsSpec(opts)

  return function randombins (alphabets: string[]|Stream<string>): Promise<string[]> {
    const combination$ = spec.toCombination$(alphabets)

    return calculateCombinationsLength(alphabets)
    .then(length => randomSizeBins(spec.randomwords, combination$, length, spec.size))
    .then(spec.randomshuffle)
  }
}

function getRandomBinsSpec (opts?: Partial<RandomBinsFactorySpec>): RandomBinsFactorySpec {
 return {
    size: opts && opts.size || 256,
    toCombination$: opts && opts.toCombination$ || toCombination$,
    randomwords: opts && opts.randomwords || getRandomWords(),
    randomshuffle: opts && opts.randomshuffle || getRandomShuffle()
  }
}

function calculateCombinationsLength (strings: string[]|Stream<string>): Promise<number> {
  try {
    return toStream<string>(strings)
    .map(str => assert(isString(str), 'invalid argument') && str.length)
    .reduce(product, 1)
  } catch (err) {
    return Promise.reject(new TypeError('invalid argument'))
  }
}

function product (a: number, b: number): number {
  return a * b
}

function assert (truthy: boolean, message: string): boolean {
  if (truthy) { return true }
  throw new TypeError(message)
}

function isString (val: any): val is string|String {
  return typeof (val && val.valueOf()) === 'string'
}
