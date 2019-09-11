/**
 * @desc 打印错误
 */

export class NormalError extends Error {
  constructor(message) {
    super(message)
    this.name = 'normal'
  }
}

export const log = (e, withStack = false) => {
  const error = typeof e !== 'string' ? e : new NormalError(e)
  console.log(`${error.name}:`, error.message)
  if (withStack) console.log(error.stack)
}
export const warn = (e, withStack = false) => {
  const error = typeof e !== 'string' ? e : new NormalError(e)
  console.warn(`${error.name}:`, error.message)
  if (withStack) console.warn(error.stack)
}
export const error = (e, withStack = true) => {
  const error = typeof e !== 'string' ? e : new NormalError(e)
  console.error(`${error.name}:`, error.message)
  if (withStack) console.error(error.stack)
}
