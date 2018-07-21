const Internal = (_) => {
  if (typeof _ != 'symbol') {
    throw TypeError('Accessor must me a symbol')
  }

  return (Klass) => {
    if (typeof Klass != 'function') {
      throw TypeError('Provided target is not a class')
    }

    const internals = {}

    Object.defineProperty(Klass.prototype, _, {
      get() {
        const _this = { ...internals }

        Object.keys(_this).forEach((key) => {
          const value = _this[key]

          if (typeof value == 'function') {
            _this[key] = value.bind(this)
          }
        })

        Object.defineProperty(this, _, {
          value: _this
        })

        return _this
      }
    })

    Object.getOwnPropertyNames(Klass.prototype).forEach((key) => {
      if (key[0] != '_') return

      const { value } = Object.getOwnPropertyDescriptor(Klass.prototype, key)

      if (typeof value != 'function') return

      const publicKey = key.slice(1)
      internals[publicKey] = value
      delete Klass.prototype[key]
    })
  }
}

export default Internal
