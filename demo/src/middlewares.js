export default [
  () => next => async action => {
    console.log(`中间件001`)
    await next(action)
    console.log(`中间件001结束`)
  },
  () => next => async action => {
    console.log(`中间件002`)
    await next(action)
    console.log(`中间件002结束`)
  },
  ({ getState }) => next => async action => {
    await next(action)
    console.log('当前状态', getState().toJS())
  },
]
