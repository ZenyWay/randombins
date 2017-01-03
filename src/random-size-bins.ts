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
import { Stream, from as toStream, throwError } from 'most'

/**
 * @param {(length: number) => Uint16Array} randomwords
 * @param {Stream<string>} combination$
 * @param {number} length of combination$, i.e. number of elements
 * @param {number} size number of randomly selected bins,
 * including the first which always starts with the first combination.
 *
 * @return {Promise<string>} combination entries randomly selected
 * from combination$, systematically starting with the latter's first entry.
 */
export default function (randomwords: (length: number) => Uint16Array,
combination$: Stream<string>, length: number, size: number): Promise<string[]> {
  const first$ = combination$.take(1)
  const combinationsLength = length - 1 // exclude first (added separately)
  const randomsLength = size - 1 // exclude first (always 0)

  return !isValidBinSize(combinationsLength / randomsLength)
  ? Promise.reject(new RangeError('bin size out-of-range'))
  : toStream<number>(randomwords(randomsLength))
  .loop(({ combination$, index }, random) => {
    const next = index + combinationsLength
    const step = Math.floor(next / randomsLength) - Math.floor(index / randomsLength)
    const skip = (step * random) >>> 16 // random is a word

    return {
      value: combination$.skip(skip).take(1),
      seed: {
        combination$: combination$.skip(step),
        index: next
      }
    }
  }, {
    combination$: combination$.skip(1), // exclude first
    index: 0
  })
  .startWith(first$)
  .join()
  .reduce<string[]>(push, [])
}

function isValidBinSize(size: number): boolean {
  return (size > 1) && (size < 32768) // within Shannon limit of random words range
}

function push <T>(arr: T[], val: T): T[] {
  arr.push(val)
  return arr
}
