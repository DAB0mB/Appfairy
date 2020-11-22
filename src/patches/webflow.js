// Binds Appfairy encapsulation to Webflow interactions
// NOTE: This has to be loaded BEFORE webflow.js
window.__defineSetter__('Webflow', (Webflow) => {
  const superRequire = Webflow.require

  const walk = (obj, cb) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value instanceof Object) {
        walk(value, cb)
      }

      cb(key, value, obj)
    })
  }

  Webflow.require = (name) => {
    const module = Object.assign({}, superRequire(name))

    if (/^ix2?$/.test(name)) {
      const superInit = module.init

      module.init = (config) => {
        walk(config, (key, value, config) => {
          if (key == 'selector') {
            config.selector = config.selector
              .replace(/\.([\w_-]+)/g, '.af-class-$1')
              .replace(/\[class(.?)="( ?)([^"]+)( ?)"\]/g, '[class$1="$2af-class-$3$4"]')
          }
        })

        return superInit(config)
      }
    }

    return module
  }

  window.__defineGetter__('Webflow', () => {
    return Webflow
  })
})
