import initialState from './initialState'
import middlewares from './middlewares'
import effects from './effects'
import { create } from '../../src'

const { useDispatch, useStore, Provider } = create({ initialState, middlewares, effects })
export { useDispatch, useStore, Provider }
