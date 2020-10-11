import { of } from 'fp-ts/Task'

it('of constructor', async () => {
  const myTask = of('abc')
  const result = await myTask()
  expect(result).toBe('abc')
})

it('promise', async () => {
  const myTask = () => Promise.resolve('abc')
  const result = await myTask()
  expect(result).toBe('abc')
})
