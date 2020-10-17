import * as t from 'io-ts'
import { pipe } from 'fp-ts/pipeable'
import * as E from 'fp-ts/Either'
import {absurd} from 'fp-ts/lib/function'

it('string codec', () => {
  const string = new t.Type<string, string, unknown>(
    'string',
    (input: unknown): input is string => typeof input === 'string',
    (input, context) => (typeof input === 'string'
      ? t.success(input)
      : t.failure(input, context, 'an invalid string')
    ),
    t.identity
  )

  expect(string.decode('str')).toEqual(E.right('str'))
  
  pipe(
    string.decode(null),
    E.fold(
      errors => expect(errors[0].message).toBe('an invalid string'),
      absurd,
    )
  )
})
