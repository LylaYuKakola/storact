import { COMMON_TYPE } from '../../src'

export const CLICK = Symbol('click')
export const REVERT = Symbol('revert')
export default dispatch => ({
  [CLICK]: () => {
    dispatch({
      type: COMMON_TYPE.PUSH,
      payload: {
        keys: ['dates'],
        data: Date.now(),
      },
    })
  },
  [REVERT]: () => {
    dispatch({
      type: COMMON_TYPE.POP,
      payload: {
        keys: ['dates'],
      },
    })
  },
})
