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
import getRandomBins from '../src'
import * as most from 'most'
import { __assign as assign } from 'tslib'

interface TestResult {
  value?: any
  error?: any
}

const result: TestResult = {}

const ALPHABETS = [ '0123', 'abcd', 'ABCD' ]

const ALPHABETS_32768_3 = [ '012345', 'abcdefghijklmnop', 'ABCDEFGHIJKLMNOP' ]
.concat(ALPHABETS) // 6*16*16*64 = 3*32768

const ALPHABETS_ITERABLE = <Iterable<string> & Iterator<string>>{
  [Symbol.iterator] () {
    const iterator = Object.create(this)
    iterator.keys = ALPHABETS.keys()
    return iterator
  },
  next () {
    const next = this.keys.next()
    return {
      done: next.done,
      value: next.done ? undefined : this.alphabets[next.value]
    }
  },
  alphabets: ALPHABETS
}

const ALPHABET$ = most.from<string>(ALPHABETS)

const COMBINATION$ = most.from([
  '0aA', '0aB', '0aC', '0aD', '0bA', '0bB', '0bC', '0bD',
  '0cA', '0cB', '0cC', '0cD', '0dA', '0dB', '0dC', '0dD',
  '1aA', '1aB', '1aC', '1aD', '1bA', '1bB', '1bC', '1bD',
  '1cA', '1cB', '1cC', '1cD', '1dA', '1dB', '1dC', '1dD',
  '2aA', '2aB', '2aC', '2aD', '2bA', '2bB', '2bC', '2bD',
  '2cA', '2cB', '2cC', '2cD', '2dA', '2dB', '2dC', '2dD',
  '3aA', '3aB', '3aC', '3aD', '3bA', '3bB', '3bC', '3bD',
  '3cA', '3cB', '3cC', '3cD', '3dA', '3dB', '3dC', '3dD',
])

const COMBINATION_32678_3$ = most.iterate(sum => ++sum, 0).take(3 * 32768)

const ALPHABETS_OUT_OF_RANGE_1_3 = [ '01', 'ab'] // 2*2 = 3*1 + 1

const ALPHABETS_OUT_OF_RANGE_32768_3 =
[ '01234', new Array(19662).join('*') ] // 5*19661 = 3*32768 + 1

const RANDOM_WORDS = new Uint16Array([ 0, 65541 / 7, 65538 / 3 ]) // ceil

const RANDOM_SIZE_BINS = [ '0aA', '0aB', '1cB', '3aC' ]

function isString (val:any): val is String|string {
  return typeof (val && val.valueOf()) === 'string'
}

function push <T>(arr: T[], val: T): T[] {
  arr.push(val)
  return arr
}

beforeEach (() => {
  delete result.value
  delete result.error
})

describe('getRandomBins (opts?: Partial<RandomBinsFactorySpec>): ' +
'(alphabets: string[]|Stream<string>): Stream<string>', () => {
  describe('when called without argument', () => {
    beforeEach(() => {
      try {
        result.value = getRandomBins()
      } catch (err) {
        result.error = err
      }
    })

    it('returns the default `randombins (alphabets: string[]|Stream<string>): ' +
    'Promise<string[]>` function', () => {
      expect(result.error).toBeUndefined()
      expect(result.value).toEqual(jasmine.any(Function))
    })
  })
})

describe('randombins (alphabets: string[]|Stream<string>): Stream<string>',
() => {
  let toCombination$: jasmine.Spy
  let randomwords: jasmine.Spy
  let randombins: (alphabets: any) => most.Stream<string>

  beforeEach(() => {
    toCombination$ = jasmine.createSpy('toCombination$')
    .and.returnValues(COMBINATION$, COMBINATION$, COMBINATION$,
    COMBINATION_32678_3$)

    randomwords = jasmine.createSpy('randomwords')
    .and.returnValue(RANDOM_WORDS)

    randombins = getRandomBins({
      size: 4,
      toCombination$: toCombination$,
      randomwords: randomwords
    })
  })

  describe('when given an Iterable or Stream of strings', () => {
    beforeEach((done) => {
      most.from([
        ALPHABETS,
        ALPHABETS_ITERABLE,
        ALPHABET$,
        ALPHABETS_32768_3
      ])
      .map(randombins)
      .concatMap(bins => most.fromPromise(bins.reduce(push, [])))
      .reduce(push, [])
      .then(arr => result.value = arr)
      .catch(err => result.error = err)
      .then(() => setTimeout(done))
    }, 30000) // extended timeout

    it('resolves to an Array<string> instance with shuffled, randomly selected ' +
    'combinations of characters from each alphabet in the given sequence', () => {
      expect(result.value).toEqual([
        RANDOM_SIZE_BINS, RANDOM_SIZE_BINS, RANDOM_SIZE_BINS, [ 0, 1, 37449, 76459 ]
      ])
      expect(result.error).toBeUndefined()
      expect(toCombination$.calls.allArgs()).toEqual([
        [ ALPHABETS ], [ ALPHABETS_ITERABLE ], [ ALPHABET$ ], [ ALPHABETS_32768_3 ]
      ])
      expect(randomwords.calls.allArgs()).toEqual([
        [ 3 ], [ 3 ], [ 3 ], [ 3 ]
      ])
    })
  })

  describe('when not given any argument', () => {
    beforeEach((done) => {
      ;(<any>randombins)()
      .reduce(push, [])
      .then((arr: any[]) => result.value = arr)
      .catch((err: any) => result.error = err)
      .then(() => setTimeout(done))
    })

    it('rejects with an "invalid argument" TypeError', () => {
      expect(result.value).toBeUndefined()
      expect(result.error).toEqual(jasmine.any(TypeError))
      expect(result.error.message).toBe('invalid argument')
    })
  })

  describe('when given anything else than an Iterable or Stream of strings', () => {
    beforeEach((done) => {
      most.from([
        null, undefined, true, 42, /* 'foo', this is an Iterable<string> ! */
        () => {}, [ 42, 'foo' ], { foo: 'foo' }
      ])
      .map(randombins)
      .flatMap((val$: most.Stream<any>) => val$
        .recoverWith((err: any) => most.of(err)))
      .reduce(push, []) // toArray
      .then(arr => result.error = arr)
      .then(() => setTimeout(done))
    })
    it('rejects with an "invalid argument" TypeError', () => {
      expect(result.error.length).toBe(7)
      result.error.forEach((err: any) => {
        expect(err).toEqual(jasmine.any(TypeError))
        expect(err.message).toBe('invalid argument')
      })
    })
  })

  describe('when given an Iterable or Stream of strings that results ' +
  'in an average bin size outside the valid range of ]1, 32768[', () => {
    beforeEach((done) => {
      toCombination$.and.returnValue(COMBINATION$)
      most.from([
        ALPHABETS_OUT_OF_RANGE_1_3,
        ALPHABETS_OUT_OF_RANGE_32768_3
      ])
      .map(randombins)
      .flatMap((val$: most.Stream<any>) => val$
        .recoverWith((err: any) => most.of(err)))
      .reduce(push, []) // toArray
      .then(arr => result.error = arr)
      .then(() => setTimeout(done))
    }, 20000) // extended timeout
    it('rejects with a "bin size out-of-range" RangeError', () => {
      expect(result.error.length).toBe(2)
      result.error.forEach((err: any) => {
        expect(err).toEqual(jasmine.any(RangeError))
        expect(err.message).toBe('bin size out-of-range')
      })
    })
  })
})
