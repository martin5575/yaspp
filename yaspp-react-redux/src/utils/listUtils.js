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

export const dictionarize = (array) => {
  return array.reduce((result, y) => {
    result[y.id] = y
    return result
  }, {})
}
