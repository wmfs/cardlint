/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const J2119Validator = require('@wmfs/j2119')
const SCHEMA = require.resolve('./../lib/schema/AdaptiveCard.j2119')
const CARDS = {
  valid: require('./fixtures/valid.json'),
  empty: require('./fixtures/empty.json'),
  acAct: require('./fixtures/action-test'),
  acCar: require('./fixtures/card-element-test')
}

describe('Adaptive Cards Lint', () => {
  const validator = J2119Validator(SCHEMA)
  const cardElementErrorBattery = [
    'Field "bannedField" not allowed in Adaptive Card.body[0]',
    'Field "bannedField" not allowed in Adaptive Card.body[1].sources[0]',
    'Field "bannedField" not allowed in Adaptive Card.body[1]',
    'Adaptive Card.body[2].items[0].maxLines is "-12", but allowed floor is 0',
    'Field "bannedField" not allowed in Adaptive Card.body[2].items[1].columns[0]',
    'Adaptive Card.body[2].items[1].columns[1].type is "NotAColumn", not one of the allowed values Column,Fact,Image',
    'Field "bannedField" not allowed in Adaptive Card.body[2].items[1]',
    'Field "bannedField" not allowed in Adaptive Card.body[2].items[2]',
    'Field "bannedField" not allowed in Adaptive Card.body[2].items[3].images[0]',
    'Adaptive Card.body[2].items[3].images[1].type is "NotAnImage", not one of the allowed values Column,Fact,Image',
    'Field "bannedField" not allowed in Adaptive Card.body[2].items[3]',
    'Field "bannedField" not allowed in Adaptive Card.body[2]',
    'Adaptive Card.body[3].type is "Non-existent", not one of the allowed values Container,TextBlock,Image,Media,MediaSource',
    'Field "bannedField" not allowed in Adaptive Card'
  ]

  it('Valid', () => {
    const result = validator.validate(CARDS.valid)
    expect(result.length).to.eql(0)
  })

  it('Missing type', () => {
    const result = validator.validate(CARDS.empty)
    expect(result.length).to.eql(2)
    expect(result.includes('Adaptive Card does not have required field "type"')).to.eql(true)
    expect(result.includes('Adaptive Card does not have required field "version"')).to.eql(true)
  })

  it('Adaptive Card and Action Test', () => {
    const result = validator.validate(CARDS.acAct)
    expect(result.length).to.eql(2)
    expect(result.includes('Field "bannedField" is not allowed in Adaptive Card'))
    expect(result.includes('Field "bannedField" is not allowed in Action'))
  })

  it('Adaptive Card and Card Element Test', () => {
    const result = validator.validate(CARDS.acCar)
    const simRes = []
    expect(result.length).to.eql(14)
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < cardElementErrorBattery.length; j++) {
        if (result[i] === cardElementErrorBattery[j]) {
          simRes.push(result[i])
          break
        }
      }
    }
    simRes.forEach(msg => {
      const resIn = result.indexOf(msg)
      result.splice(resIn, 1)
      const batIn = cardElementErrorBattery.indexOf(msg)
      cardElementErrorBattery.splice(batIn, 1)
    })
    expect(result.length).to.eql(0)
    expect(cardElementErrorBattery.length).to.eql(0)
  })
})
