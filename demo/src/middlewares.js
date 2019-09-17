import { COMMON_TYPE } from '../../src'

let actionIndex = 0

export default [
  (dispatch, next) => async action => {
    console.log(`我是第${actionIndex++}个action`)
    await next(action)
  },
  (dispatch, next) => async action => {
    const { type } = action
    if (type === 'click') {
      dispatch({
        type: COMMON_TYPE.PUSH,
        payload: {
          keys: ['dates'],
          data: Date.now(),
        },
      })
      return
    }

    if (type === 'getTime') {
      try {
        const result = await fetch('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp').then(res => res.json())
        await dispatch({
          type: COMMON_TYPE.PUSH,
          payload: {
            keys: ['dates'],
            data: `当前时间：${result.data.t}`,
          },
        })
      } catch (e) {
        throw e
      }
      return
    }

    await next(action)
  },
]
