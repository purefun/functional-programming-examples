import { contramap, fromCompare, getDualOrd, Ord, ordNumber } from 'fp-ts/lib/Ord'

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x: A, y: A) => O.compare(x, y) === 1 ? y : x
}

it('min', () => {
  const lessNumber = min(ordNumber)(2, 1)
  expect(lessNumber).toBe(1)
})

it('getDualOrd', () => {
  function max<A>(O: Ord<A>): (x: A, y: A) => A {
    return min(getDualOrd(O))
  }
  const greater = max(ordNumber)(2, 1)

  expect(greater).toBe(2)
})

type User = {
  name: string
  age: number
}

const nil: User = { name: 'nil', age: 50 }
const nilson: User = { name: 'nilson', age: 35 }

it('compares by property without contramap', () => {
  const byAge: Ord<User> = fromCompare((x, y) =>
    ordNumber.compare(x.age, y.age))

  const getYounger = min(byAge)
  const younger = getYounger(nil, nilson)

  expect(younger).toBe(nilson)
})

it('contramap', () => {
  const byAge = contramap((user: User) => user.age)(ordNumber)

  const getYounger = min(byAge)
  const younger = getYounger(nil, nilson)

  expect(younger).toBe(nilson)
})
