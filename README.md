# storact

    A Redux-like State Manager for React

参照redux结合react-hooks实现的状态管理工具，在保留redux的 **"状态只读"** 和 **"纯函数修改"** 的基础上，做了以下的修改

  1. 固化了reducer，提供了merge、update、delete、clear、push、pop、shift、unshift这几种基本的action，满足基本的对状态的操作
  2. dispatch调用action的方式改成属性方法调用
  3. 实现了类似koa的中间件扩展方式
  4. 提供dispatch的防抖、节流、延迟、挂起的配置，丰富了action

# 使用

npm install storact

```javascript
import storact from 'storact'

const {
  Provider, // 容器
  useDispatch, // 获取dispatch的react-use
  useStoreState, // 获取store状态的react-use
} = storact({
  initialState, // store的初始状态
  middlewares, // 中间件们
  effects, // 副作用集合
})

// ...

```

### 1. 基本创建

create方法的入参为一个对象，包含如下三个属性

  - initialState：构建store的初始数据，一个key-value结构的Object
  - middlewares：中间件，一个数组（具体的编写使用在后边详细说明）
  - effects：副作用集合，一个数组（具体的编写使用在后边详细说明）
  
create方法的出参也是一个对象，同样包含三个属性

  - Provider：提供容器
  - useDispatch： 暴露dispatch方法
  - useStore：暴露store的数据

开始使用事，可以先不用关心 _middlewares_ 和 _effects_ ，直接写入 _initialState_ 即可

```javascript
import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { create } from 'storact' // 引入create方法

const initialState = {
  times: 0, // 记录次数
  dates: [], // 记录当前日期
}

const { useDispatch, useStore, Provider } = create({ initialState }) // 此时先忽略 middlewares 和 effects

// Example组件
function Example() {
  const store = useStore() // 引入store中的数据
  return (
    <p>当前点击次数：{store.get('times')}</p>
  ) // 展示store中的数据
}

render(
  <Provider><Example /></Provider>,
  document.querySelector('#root')
)
```

以上例子展示了store的创建和store中数据的使用


### 2. 使用dispatch操作store

dispatch的基本使用：

```
dispatch[action的类型](参数)
```

dispatch的基本action类型如下

1.UPDATE: 更新某个数据，包含两个参数，第一个参数为keyPath，为需要更新的路径，第二个参数为要更新的内容
```javascript
// 参数类似于immutableJS的setIn方法
dispatch.update(['dates', 2], '?????')
```

2.DELETE: 删除某个数据，包含一个参数为keyPath
```javascript
// 参数类似于immutableJS的deleteIn方法
dispatch.update(['dates', 0])
```

3.MERGE：针对Map类型的数据，两个参数，第一个参数为keyPath，为需要更新的路径，第二个参数为要更新的内容
```javascript
// 参数类似于immutableJS的mergeIn方法
dispatch.update(['dates', 0], { now: Date.now() })
```

4.CLEAR: 针对List类型的数据，做清空操作，包含一个参数为keyPath
```javascript
// 参数类似于immutableJS的clear方法
dispatch.update(['dates'])
```

5.INSERT: 针对List类型的数据，做插入，两个参数，第一个参数为keyPath，为需要更新的路径，第二个参数insert的参数数组
```javascript
// 参数类似于immutableJS的insert方法
dispatch.update(['dates'], [2, Date.now()]) // 在第二项插入当前时间
```

6.PUSH: 针对List类型的数据，做push
```javascript
dispatch.update(['dates'], Date.now())
```

7.POP: 针对List类型的数据，做pop
```javascript
dispatch.update(['dates']) // 在第二项插入当前时间
```

8.SHIFT: 针对List类型的数据，做shift
```javascript
dispatch.update(['dates'])
```

9.UNSHIFT: 针对List类型的数据，做unshift
```javascript
dispatch.update(['dates'], Date.now())
```

下面例子仅重写了 Example 组件，增加了点击和清除的操作

```javascript
// 增加dispatch操作

function Example() {
  const store = useStore() // 引入store中的数据
  const dispatch = useDispatch() // 引入操作
  
  // 增加一次点击次数，并记录点击发生的时间戳
  const handleClick = useCallback(() => {
    const currentTimes = store.get('times')
    dispatch.update(['times'], currentTimes + 1)
    dispatch.push(['dates'], Date.now())
  }, [store])
  
  // 重置状态
    const handleClear = useCallback(() => {
      dispatch.update(['times'], 0)
      dispatch.clear(['dates'])
    }, [])
  
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <br />
      <button onClick={handleClear}>Clear</button>
      <br />
      <p>当前点击次数:{store.get('times')}</p>
    </div>
  ) // 展示store中的数据
}
```

### 3. 使用Effects扩展dispatch

effects在这里不仅仅是处理副作用的，它更像对dispatch的action的扩展，入侵式丰富dispatch的类型

例子如下，包含三个扩展

1. markCurrentTime: 一个包含异步获取数据的操作
2. click：对点击操作进行封装
3. clickTwice: 一次执行两个click操作
4. clickWithMessage: 展示特定的信息（用来演示传参的方式）

```javascript
// 把这个加到create方法里边，然后就可以在dispatch中使用了
const effects = {
  markCurrentTime: ({ dispatch }) => async () => {
      try {
        const result = await new Promise(resolve => {
          setTimeout(() => {
            resolve(Date.now())
          }, 1000)
        })
        dispatch.push(['dates'], `当前时间：${result}`)
      } catch (e) {
        throw e
      }
    },
    click: ({ getState, dispatch }) => async () => {
      const currentTimes = getState().get('times')
      dispatch.push(['dates'], `当前时间：${Date.now()}`)
      await dispatch.update(['times'], currentTimes + 1)
    },
    clickTwice: ({ dispatch }) => async () => {
      await dispatch.click()
      await dispatch.click()
    },
    clickWithMessage: ({ dispatch }) => async message => {
      const currentTimes = getState().get('times')
      dispatch.push(['dates'], `当前记录内容：${message}`)
      await dispatch.update(['times'], currentTimes + 1)
    },
}
```

重写 Example 方法，演示使用effects处理之后的dispatch

```javascript
function Example() {
  const store = useStore() // 引入store中的数据
  const dispatch = useDispatch() // 引入操作
  
  const handleClick = useCallback(() => {
    dispatch.click() // 直接触发 Effects 中的click操作
  }, [])
  
  const handleClickTwice = useCallback(() => {
    dispatch.clickTwice() // 直接触发 Effects 中的clickTwice操作
  }, [])

  const handleClickSideEffect = useCallback(() => {
    dispatch.markCurrentTime() // 直接触发 Effects 中的 markCurrentTime 操作
  }, [dispatch])
  
  const handleClickWithMessage = useCallback(() => {
    dispatch.clickWithMessage('XXXXXXXX') // 直接触发 Effects 中的 clickWithMessage 操作
  }, [dispatch])
  
  // 重置状态
  const handleClear = useCallback(() => {
    dispatch.update(['times'], 0)
    dispatch.clear(['dates'])
  }, [])
  
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <br />
      <button onClick={handleClickTwice}>Click Twice</button>
      <br />
      <button onClick={handleClickSideEffect}>Click Side Effect</button>
      <br />
      <button onClick={handleClickWithMessage}>Click With Message</button>
      <br />
      <button onClick={handleClear}>Clear</button>
      <br />
      <p>当前点击次数:{store.get('times')}</p>
    </div>
  )
}
```

### 4. 使用Middlewares增强dispatch

middlewares是用来扩展dispatch的功能的，可以理解为，给dispatch带来自定义的生命周期，也就是说每次dispatch的时候都会按顺序触发

主要参考koa的洋葱圈设计，示例如下

```javascript
const middlewares=[
  () => next => async action => {
    console.log('第一层中间件，开始')
    await next(action)
    console.log('第一层中间件，结束')
  },
  () => next => async action => {
    console.log('第二层中间件，开始')
    await next(action)
    console.log('第二层中间件，结束')
  },
  ({ getState, dispatch }) => next => async action => {
    await next(action)
    console.log('第三层中间件：当前状态', getState().toJS())
  },
]
```

当执行dispatch的时候，会展示如下内容

```javascript
// 第一层中间件，开始
// 第二层中间件，开始
// 第三层中间件：当前状态： XXXXX.....
// 第二层中间件，结束
// 第一层中间件，结束
```

同时解释以下各个参数

1. getState: 获取当前状态数据的方法
2. dispatch: 这个dispatch是effects处理之后的dispatch，也就是可以在中间件中直接执行dispatch
3. next: 执行下一个中间件，是保证中间件链向下执行的方法，也就是说它可以控制是否向下执行
4. action: 是获取到的当前触发这个中间件执行的的dispatch的参数的action形式

_这里的action参数的设计有些奇怪，因为原本redux的action设计是"{ type, payload }"，所以这里保留了这个设计形式_

middleware可以修改action，也可以拦截dispatch

```javascript

// 修改action
const middleware1 = () => next => async action => {
  action.type = "XXX" //经过这个中间件的action，type都被修改为 XXX
  await next(action)
}

// 拦截
const middleware1 = () => next => async action => {
  if (someReason) {
    return // 直接不执行next了，完成了拦截操作
  }
  await next(action)
}

```

### 5. 通过dispatch.config方法配置不同场景的dispatch

storact提供的dispatch的防抖、节流、延迟、挂起的配置

dispatch.config会直接返回一个新的dispatch

```javascript
const dispatchWithDelay = dispatch.config({ [COMMON_CONFIG.DELAY]: 1000 })
dispatchWithDelay.markCurrentTime() // 延迟一秒触发

const dispatchWithDebounce = dispatch.config({ [COMMON_CONFIG.DEBOUNCE]: 1000 })
dispatchWithDebounce.markCurrentTime() // 延迟1秒，1秒内同类型的dispatch有新的，则取消老的

const dispatchWithThrottle = dispatch.config({ [COMMON_CONFIG.THROTTLE]: 1000 })
dispatchWithThrottle.markCurrentTime() // 1秒内同类型的dispatch只执行一个

const dispatchWithPend = dispatch.config({ [COMMON_CONFIG.PEND]: true })
dispatchWithPend.markCurrentTime() // 挂起，等待结束之后才能执行下一个同类型的dispatch

```



# 注意

1. 每个middleware最后返回的必须为async函数，且next执行前必须加await
2. 每个effect最后返回的必须为async函数
3. initialState请务必使用一个key-value形式的object










