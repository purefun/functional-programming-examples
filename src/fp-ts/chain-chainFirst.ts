import {pipe} from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/Task'
import * as C from 'fp-ts/Console'

it('chain', async () => {

  const program = pipe(
    T.of(1),
    T.chain(count => T.of(count + 1))
  )
  const count = await program()
  expect(count).toBe(2)
})

it('chainFirst', async () => {
  const program: T.Task<string> = pipe(
    T.of(1),
    T.chain(count => T.of(String(count))),
    // see the console output
    T.chainFirst(countString => T.fromIO(C.log(countString as string)))
  )
  const count = await program()
  expect(count).toBe('1')
})
