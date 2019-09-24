/**
 * @desc 根据原始的dispatch生成新的函数式action的集合
 */

export default dispatch => (
  dispatch ? new Proxy(Object.create(null), {
    get(_t, key) {
      return new Proxy(() => {}, {
        apply(_tt, _what, args) {
          dispatch({
            type: key,
            payload: args[0],
            config: args[1],
          })
        },
      })
    },
    set() {
      // FREEZE: do nothing
      console.log('original dispatch cannot be changed')
    },
  }) : () => {}
)
