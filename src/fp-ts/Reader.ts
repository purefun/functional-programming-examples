import { pipe } from 'fp-ts/lib/pipeable'
import { ask, asks, chain, Reader } from 'fp-ts/Reader'

// see: https://Ltpuredev.to/peerhenry/functional-programming-in-typescript-using-fp-ts-readertaskeither-1pei

it('asks', async () => {
  interface HttpClient {
    get: (url: string) => Promise<string[]>
  }
  const eventsResponse = ['event1', 'event2']
  const httpClient: HttpClient = {
    get: (_url: string) => Promise.resolve(eventsResponse)
  }

  type fetch = (url: string) => Reader<HttpClient, Promise<string[]>>
  const fetch = (url: string) => asks((client: HttpClient) => client.get(url))

  // const fetchEvents = fetch('events')
  const fetchEvents = pipe('events', fetch)
  const events = await fetchEvents(httpClient)
  expect(events).toBe(eventsResponse)
})

// see: https://dev.to/gcanti/getting-started-with-fp-ts-reader-1ie5

it('composition without dependencies', () => {
  const f = (b: boolean): string => (b ? 'true': 'false')
  const g = (n: number): string => f(n > 2)
  const h = (s: string): string => g(s.length + 1)

  expect(h('foo')).toBe('true')
})

interface Dependencies {
  i18n: {
    true: string
    false: string
  },
  lowBound: number
}

const instance: Dependencies = {
  i18n: {
    true: 'vero',
    false: 'falso'
  },
  lowBound: 4
}

it('dependencies without curried', () => {
// h1 and g1 must have knowledge about f1 dependencies despite not using them.
  const f = (b: boolean, deps: Dependencies): string => (b ? deps.i18n.true : deps.i18n.false)
  const g = (n: number, deps: Dependencies): string => f(n > 2, deps)
  const h = (s: string, deps: Dependencies): string => g(s.length + 1, deps)

  expect(h('foo', instance)).toBe('vero')
})


it('curried without Reader', () => {
  const f = (b: boolean): ((deps: Dependencies) => string) => (deps: Dependencies) => b ? deps.i18n.true : deps.i18n.false
  const g = (n: number): ((deps: Dependencies) => string) => f(n > 2)
  const h = (s: string): ((deps: Dependencies) => string) => g(s.length + 1)

  expect(h('foo')(instance)).toBe('vero')
})


it('Reader', () => {
  const f = (b: boolean): Reader<Dependencies, string> => deps => (b ? deps.i18n.true : deps.i18n.false)
  const g = (n: number): Reader<Dependencies, string> => f(n > 2)
  const h = (s: string): Reader<Dependencies, string> => g(s.length + 1)

  expect(h('foo')(instance)).toBe('vero')
})

it('pipes and ask', () => {
  const f = (b: boolean): Reader<Dependencies, string> => deps => (b ? deps.i18n.true : deps.i18n.false)
  const g = (n: number): Reader<Dependencies, string> =>
    pipe(
      ask<Dependencies>(),
      chain(deps => f(n > deps.lowBound))
    )
  const h = (s: string): Reader<Dependencies, string> => g(s.length + 1)

  expect(h('foo')(instance)).toBe('falso')
})

