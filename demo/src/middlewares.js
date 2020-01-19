export default [
  ({ getState }) => next => async action => {
    await next(action)
    console.log('当前状态', getState())
  },
]
