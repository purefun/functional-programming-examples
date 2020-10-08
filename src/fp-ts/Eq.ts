import * as assert from 'assert'
import { contramap, Eq, getStructEq } from 'fp-ts/Eq'

// primitive type

const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
}

assert.ok(eqNumber.equals(1, 1))

// compound type

type Point = {
  x: number,
  y: number,
}

const eqPoint: Eq<Point> = {
  equals: (p1, p2) => p1 === p2 || p1.x === p2.x && p1.y === p2.y,
}

const p1 = { x: 1, y: 1 }
const p2 = { x: 1, y: 1 }

assert.ok(eqPoint.equals(p1, p2))

// struct constructor

const eqPointS = getStructEq({
  x: eqNumber,
  y: eqNumber,
})

assert.ok(eqPointS.equals(p1, p2))

// contramap: entity equivalence

type User = {
  id: number
  name: string
}

const eqUser = contramap((user: User) => user.id)(eqNumber)

const user1 = { id: 1, name: 'nil' }
const user2 = { id: 1, name: 'nilson' }

assert.ok(eqUser.equals(user1, user2))
