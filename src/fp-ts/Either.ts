import { Either, chainW, fromNullable, isRight, left, of, right } from 'fp-ts/Either'
import {pipe} from 'fp-ts/lib/pipeable'

/**
 * constructor: of, left, right, fromNullable
 **/

it('of constructor', () => {
  const result = of<string, string>('success')
  expect(isRight(result)).toBe(true)
})

it('fromNullable constructor', () => {
  const errMessage = 'value is nullish'
  const value = 'abc'
  const toEither = fromNullable<string>(errMessage)

  const expectedEither = toEither(value)
  expect(expectedEither).toEqual(right(value))

  const unexpectedEither = toEither(null)
  expect(unexpectedEither).toEqual(left(errMessage))
})

// see: https://github.com/gcanti/fp-ts/issues/904
// W suffix means `Widen`
it('combines with different error types', () => {
  interface OneError { _tag: 'OneError' }
  interface TwoError { _tag: 'TwoError' }
  interface ThreeError { _tag: 'ThreeError' }

  const e1 = (): Either<OneError, string> => left({ _tag: 'OneError' })
  const e2 = (_x: string): Either<TwoError, boolean> => left({ _tag: 'TwoError' })
  const e3 = (_x: boolean): Either<ThreeError, string> => left({ _tag: 'ThreeError' })

  pipe(
    e1(),
    chainW(e2),
    chainW(e3),
    a => a, // a: Either<OneError | TwoError | ThreeError, string>
  )

})
