class Generator {
  generate() {
    throw Error('Generator.generate() must be implemented')
  }

  save() {
    throw Error('Generator.save() must be implemented')
  }
}

export default Generator
