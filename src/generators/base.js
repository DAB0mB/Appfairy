export const _ = Symbol('_Generator')

class Generator {
  constructor() {
    this[_] = {}
  }

  generate() {
    throw Error('Generator.generate() must be implemented')
  }
}

export default Generator
