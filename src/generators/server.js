import { freeText } from '../utils'
import Generator, { _ } from './base'

class ServerGenerator extends Generator {
  generate() {
    return freeText `
      const http = require('http')

      http.createServer((req, res) => {
        switch (req.url) {
          -->${this.joinRoutes()}<--
        }
      })

      module.exports = server
    `
  }
}

Object.assign(ServerGenerator.prototype[_], {
  joinRoutes() {
    
  },
})

export default ServerGenerator
