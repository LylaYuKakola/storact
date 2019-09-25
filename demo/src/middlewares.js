export default [
  () => next => async action => {
    console.group('第一层中间件')
    await next(action)
    console.groupEnd()
  },
  () => next => async action => {
    console.group('第二层中间件')
    await next(action)
    console.groupEnd()
  },
  ({ getState }) => next => async action => {
    await next(action)
    console.log('当前状态', getState().toJS())
  },
]
