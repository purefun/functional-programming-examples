import * as assert from 'assert'
import { contramap, getDualOrd, Ord, ordNumber } from 'fp-ts/lib/Ord'

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x: A, y: A) => O.compare(x, y) === 1 ? y : x
}

function max<A>(O: Ord<A>): (x: A, y: A) => A {
  return min(getDualOrd(O))
}

assert(min(ordNumber)(2, 1) === 1)

type User = {
  name: string
  age: number
}

// import { fromCompare } from 'fp-ts/Ord'

// const byAge: Ord<User> = fromCompare((x, y) =>
//   ordNumber.compare(x.age, y.age))

const byAge = contramap((user: User) => user.age)(ordNumber)
const getYounger = min(byAge)
const getOlder = max(byAge)

const nil: User = { name: 'nil', age: 50 }
const nilson: User = { name: 'nilson', age: 35 }

const younger = getYounger(nil, nilson)
assert.ok(younger === nilson)

const older = getOlder(nil, nilson)
assert.ok(older === nil)
