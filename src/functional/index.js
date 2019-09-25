/**
 * @desc 针对原始传参action的dispatch, 改造为函数式action的集合，应用在enhanced中
 */

export default dispatch => (
  dispatch ? new Proxy(Object.create(null), {
    get(_t, key) {
      return async (...args) => {
        await dispatch({
          type: key,
          payload: args[0],
          config: args[1],
        })
      }
    },
    set() {
      // FREEZE: do nothing
      console.log('original dispatch cannot be changed')
    },
  }) : () => {}
)
