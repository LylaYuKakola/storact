import initialState from './initialState'
import middlewares from './middlewares'
import effects from './effects'
import { create } from '../../src'

const test1 = create({ initialState, middlewares, effects, namespace: 'test1' })
const test2 = create({ initialState, middlewares, effects, namespace: 'test2' })

const { useDispatch, useStore, Provider } = create({ initialState, middlewares, effects, namespace: 'Global' })

export { useDispatch, useStore, Provider }
