import initialState from './initialState'
import middlewares from './middlewares'
import { create } from '../../src'

// @TODO 暂时去掉中间件的扩展
const { useDispatch, useStore, Provider } = create({ initialState, middlewares })
export { useDispatch, useStore, Provider }
