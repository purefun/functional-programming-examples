import * as t from 'io-ts'
import * as E from 'fp-ts/Either'

it('combined codecs', () => {
  const User = t.type({
    id: t.number,
    name: t.string,
  })
  const userParam = { id: 1, name: 'nil' }
  const user = User.decode(userParam)
  expect(user).toEqual(E.right(userParam))
})
