import { fromNullable, isRight, left, of, right } from 'fp-ts/Either'

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
