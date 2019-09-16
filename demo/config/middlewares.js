import { COMMON_TYPE } from '../../src'

export const CLICK = Symbol('click')
export const REVERT = Symbol('revert')
export const TIME = Symbol('time')

export default [
  (dispatch, next) => action => {
    if ([CLICK, REVERT].includes(action.type)) {
      console.log('我执行到扩展dispatch啦')
    }
    next(action)
  },
  (dispatch, next) => action => {
    const { type, payload } = action
    if (type === CLICK) {
      dispatch({
        type: COMMON_TYPE.PUSH,
        payload: {
          keys: ['dates'],
          data: Date.now(),
        },
      })
    } else if (type === REVERT) {
      dispatch({
        type: COMMON_TYPE.POP,
        payload: {
          keys: ['dates'],
        },
      })
    } else {
      next(action)
    }
  },
  (dispatch, next) => async action => {
    const { type } = action
    if (type === TIME) {
      try {
        const result = await fetch('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp').then(res => res.json())
        dispatch({
          type: COMMON_TYPE.PUSH,
          payload: {
            keys: ['dates'],
            data: `当前时间：${result.data.t}`,
          },
        })
      } catch (e) {
        debugger
      }
    } else {
      next(action)
    }
  },
]
