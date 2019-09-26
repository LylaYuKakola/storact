# async reducer uses

## 现状

reducer致力于分离副作用，所以原始的useReducer返回的dispatch是一个非阻塞的方法

## 场景一：生成的dispatch可以串起来接连触发

有一个按钮（BTN001），点击之后会在state的times属性上加一

```javascript

const handleClickBTN001 = () => {
  dispatch({  })
}

```
