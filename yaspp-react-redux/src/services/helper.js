const memoize = function(f) {
  let cache = {}
  return function() {
    const arg_str = JSON.stringify(arguments)
    console.log(cache)
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments)
    return cache[arg_str]
  }
}
