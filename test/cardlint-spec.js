/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const J2119Validator = require('@wmfs/j2119')
const SCHEMA = require.resolve('./../lib/schema/AdaptiveCard.j2119')
const CARDS = {
  valid: require('./fixtures/valid.json'),
  empty: require('./fixtures/empty.json')
}

describe('Adaptive Cards Lint', () => {
  const validator = J2119Validator(SCHEMA)

  it('Valid', () => {
    const result = validator.validate(CARDS.valid)
    console.log(result)
  })

  it('Missing type', () => {
    const result = validator.validate(CARDS.empty)
    expect(result.length).to.eql(2)
    expect(result.includes('Adaptive Card does not have required field "type"')).to.eql(true)
    expect(result.includes('Adaptive Card does not have required field "version"')).to.eql(true)
  })
})
