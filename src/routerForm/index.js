const files = require.context('.', true, /\.js$/)
let pathArr = []
let pathMap = {}
let namesMap = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  // 保存导出的路由
  pathArr = pathArr.concat(files(key).default || files(key))
  // 保存导出的name
  if (files(key).default) {
    let keys = Object.keys(files(key)).filter(item => {
      return item !== 'default'
    })
    keys.forEach(item => {
      if (!namesMap[item]) {
        namesMap[item] = files(key)[item]
      } else {
        throw new Error(`路由名称【${item}】重复`)
      }
    })
  }
})

function getPath (pathObj, basePath = '') {
  if (typeof pathObj.name !== 'string') {
    throw new Error(`路径${pathObj.path}没有提供正确的name：${pathObj.name}`)
  }
  if (pathMap[pathObj.name] === void 0) {
    if (pathObj.path.slice(0, 1) === '/') {
      pathMap[pathObj.name] = pathObj.path
    } else {
      basePath = basePath.substring(basePath.length - 1, basePath.length) === '/' ? basePath : `${basePath}/`
      pathMap[pathObj.name] = `${basePath}${pathObj.path}`
    }
  } else {
    throw new Error(`路由名称${pathObj.name}重复`)
  }
  if (pathObj.children && Array.isArray(pathObj.children)) {
    pathObj.children.forEach(item => {
      getPath(item, pathMap[pathObj.name])
    })
  }
}
pathArr.forEach(item => {
  getPath(item)
})
export default (name) => {
  return pathMap[name]
}

export {namesMap}
