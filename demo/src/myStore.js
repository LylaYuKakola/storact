import initialState from './initialState'
import middlewares from './middlewares'
import effects from './effects'
import { create } from '../../src'

// @TODO 暂时去掉中间件的扩展
const { useDispatch, useStore, Provider } = create({ initialState, middlewares, effects })
export { useDispatch, useStore, Provider }
