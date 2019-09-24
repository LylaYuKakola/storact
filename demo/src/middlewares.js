import { COMMON_TYPE } from '../../src'

export default [
  store => next => async action => {
    console.log(`开始执行action`)
    await next(action)
    console.log(`action执行结束`)
    console.log('当前状态', store.getState().toJS())
  },
  ({ getState, dispatch }) => next => async action => {
    const { type } = action
    if (type === 'click') {
      const currentTimes = getState().get('times')
      dispatch[COMMON_TYPE.PUSH](['dates'], 123123123)
      dispatch[COMMON_TYPE.UPDATE](['times'], currentTimes + 1)
      return
    }

    if (type === 'getTime') {
      try {
        const result = await fetch('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp').then(res => res.json())
        dispatch[COMMON_TYPE.PUSH]({
          keys: ['dates'],
          data: `当前时间：${result.data.t}`,
        })
      } catch (e) {
        throw e
      }
      return
    }
    await next(action)
  },
]
