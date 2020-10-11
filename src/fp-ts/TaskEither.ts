import { pipe } from 'fp-ts/pipeable'
import * as C from 'fp-ts/Console'
import * as TE from 'fp-ts/TaskEither'

enum Currency {
  USD = 'USD',
  CNY = 'CNY',
}

interface API {
  rate: (a: Currency, b: Currency) => Promise<number>
}

const apiInstance: API = {
  rate: (a, b) => Math.random() > 0.5 ? Promise.resolve(0.6) : Promise.reject('some error'),
}

const getRate = TE.tryCatch(() => apiInstance.rate(Currency.CNY, Currency.USD), (reason) => String(reason))

const main = pipe(
  getRate,
  TE.chainFirst(rate => TE.rightIO(C.log(`rate: ${rate}`))),
  TE.chain(rate => TE.of(rate * 100)),
)

main()
  .then(console.log).
  catch(err => {
    // never reach
    console.error('error', err)
  })
