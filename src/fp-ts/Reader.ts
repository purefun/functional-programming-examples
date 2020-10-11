import * as assert from 'assert'
import {pipe} from 'fp-ts/lib/pipeable'
import { ask, chain, Reader } from 'fp-ts/Reader'

// see: https://dev.to/gcanti/getting-started-with-fp-ts-reader-1ie5

// without Reader

// existed code

const f0 = (b: boolean): string => (b ? 'true': 'false')
const g0 = (n: number): string => f0(n > 2)
const h0 = (s: string): string => g0(s.length + 1)

assert.ok(h0('foo') === 'true')

// new requirement: internationalise f

interface Dependencies {
  i18n: {
    true: string
    false: string
  },
  lowBound: number
}

const instance: Dependencies = {
  i18n: {
    true: 'vero',
    false: 'falso'
  },
  lowBound: 4
}

// h1 and g1 must have knowledge about f1 dependencies despite not using them.
const f1 = (b: boolean, deps: Dependencies): string => (b ? deps.i18n.true : deps.i18n.false)
const g1 = (n: number, deps: Dependencies): string => f1(n > 2, deps)
const h1 = (s: string, deps: Dependencies): string => g1(s.length + 1, deps)

assert.ok(h1('foo', instance) === 'vero')

// curried

const f2 = (b: boolean): ((deps: Dependencies) => string) => (deps: Dependencies) => b ? deps.i18n.true : deps.i18n.false
const g2 = (n: number): ((deps: Dependencies) => string) => f2(n > 2)
const h2 = (s: string): ((deps: Dependencies) => string) => g2(s.length + 1)

assert.ok(h2('foo')(instance) === 'vero')

// Reader

const f3 = (b: boolean): Reader<Dependencies, string> => deps => (b ? deps.i18n.true : deps.i18n.false)
const g3 = (n: number): Reader<Dependencies, string> => f3(n > 2)
const h3 = (s: string): Reader<Dependencies, string> => g3(s.length + 1)

assert.ok(h3('foo')(instance) === 'vero')

// ask

const f4 = f3
const g4 = (n: number): Reader<Dependencies, string> =>
  pipe(
    ask<Dependencies>(),
    chain(deps => f4(n < deps.lowBound))
  )
const h4 = (s: string): Reader<Dependencies, string> => g4(s.length + 1)

assert.ok(h4('foo')(instance) === 'vero')
