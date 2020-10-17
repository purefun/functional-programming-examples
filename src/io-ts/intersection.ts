import * as t from 'io-ts'
import { pipe } from 'fp-ts/pipeable'
import * as E from 'fp-ts/Either'
import { absurd } from 'fp-ts/lib/function'

it('intersection', () => {
  const UserId = t.type({
    id: t.number
  })

  const UserData = t.type({
    name: t.string
  })

  const User = t.intersection([UserId, UserData])
  type User = t.TypeOf<typeof User>

  const userDto = { id: 1, name: 'nil' }
  pipe(
    userDto,
    User.decode,
    E.fold(absurd, user => expect(user).toEqual(userDto))
  )
})
