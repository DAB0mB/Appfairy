import assert from 'assert'
import { transpile } from '../src'
describe('Testing Webflow Transformations...', function () {
  describe('Webflow -> React tests...', function () {
    it('should put input in the output', function () {
      transpile({
        input: 'test/data/input0',
        output: 'test/data/output0'
      })
    })
  })
})
