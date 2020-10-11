import { contramap, Eq, eqNumber, getStructEq } from 'fp-ts/Eq'

it('equals', () => {

  // local eqNumber
  const eqNumber: Eq<number> = {
    equals: (x, y) => x === y,
  }

  expect(eqNumber.equals(1, 1)).toBe(true)
})

type Point = {
  x: number,
  y: number,
}

const p1: Point = { x: 1, y: 1 }
const p2: Point = { x: 1, y: 1 }

it('equals without getStructEq', () => {
  const eqPoint: Eq<Point> = {
    equals: (p1, p2) => p1 === p2 || p1.x === p2.x && p1.y === p2.y,
  }

  expect(eqPoint.equals(p1, p2)).toBe(true)
})

it('getStructEq', () => {
  const eqPoint = getStructEq({
    x: eqNumber,
    y: eqNumber,
  })

  expect(eqPoint.equals(p1, p2)).toBe(true)
})

it('contramap', () => {
  type User = {
    id: number
    name: string
  }

  const eqUser = contramap((user: User) => user.id)(eqNumber)

  const user1: User = { id: 1, name: 'nil' }
  const user2: User = { id: 1, name: 'nilson' }

  expect(eqUser.equals(user1, user2)).toBe(true)
})
