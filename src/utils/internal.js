const Internal = (accessor) => {
  if (typeof accessor != 'symbol') {
    throw TypeError('Accessor must me a symbol')
  }

  return (Klass) => {
    if (typeof Klass != 'function') {
      throw TypeError('Provided target is not a class')
    }

    const internals = {}

    Object.defineProperty(Klass.prototype, _, {
      get() {
        return this[_] = internals
      },
      set(internals) {
        internals = { ...internals }

        Object.keys(internals).forEach((key) => {
          const val = internals[key]

          if (typeof val == 'function') {
            internals[key] = val.bind(this)
          }
        })

        Object.defineProperty(this, _, {
          value: internals,
        })
      },
    })

    Object.keys(Klass.prototype).forEach((k) => {
      if (key[0] != '_') return

      const val = Klass.prototype[key]

      if (typeof val != 'function') return

      const publicKey = key.slice(1)
      internals[publicKey] = val
      delete Klass.prototype[k]
    })
  }
}

export default Internal
