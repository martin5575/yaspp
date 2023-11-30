export const groupByField = (xs, key) => {
  return xs.reduce((rv, x) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const groupByFunc = (xs, func) => {
  return xs.reduce((rv, x) => {
    const key = func(x)
    ;(rv[key] = rv[key] || []).push(x)
    return rv
  }, {})
}

export const groupByArray = (xs, key) => {
  return xs.reduce((rv, x) => {
    let v = key instanceof Function ? key(x) : x[key]
    let el = rv.find((r) => r && r.key === v)

    if (el) {
      el.values.push(x)
    } else {
      rv.push({ key: v, values: [x] })
    }

    return rv
  }, [])
}

export const dictionarize = (array) => {
  return array.reduce((result, y) => {
    result[y.id] = y
    return result
  }, {})
}

export const sortByField = (xs, keyOrKeys) => xs.sort(compare(keyOrKeys))

const compareByKey = (key) => (a, b) => {
  if (a[key] < b[key]) return -1
  if (a[key] > b[key]) return 1
  return 0
}


export const compare = (keys) => (a, b) => {
  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    const res = compareByKey(key)(a, b)
    if (res !== 0) return res
  }
  return 0
}

export const sum = (xs) => xs.reduce((res, x) => res + x, 0)
