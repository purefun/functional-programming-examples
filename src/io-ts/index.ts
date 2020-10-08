import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import * as assert from 'assert'

// example of t.string

const string = new t.Type<string, string, unknown>(
  'string',
  (input: unknown): input is string => typeof input === 'string',
  (input, context) => (typeof input === 'string' ? t.success(input) : t.failure(input, context)),
  t.identity
)

console.log(string.decode('a string'))
console.log(string.decode(null))

// combined

const User = t.type({
  id: t.number,
  name: t.string,
})

type User = t.TypeOf<typeof User>

const user1 = User.decode({ id: 1, name: 'nil' })
const user2 = User.decode({ id: null, name: 'nil' })

assert.ok(E.isRight(user1))
assert.ok(E.isLeft(user2))
