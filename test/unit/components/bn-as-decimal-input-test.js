import React from 'react'
import assert from 'assert'

import additions from 'react-testutils-additions'
import TestRenderer from 'react-test-renderer'
import ReactTestUtils from 'react-dom/test-utils'
import { BN } from 'ethereumjs-util'

import BnInput from '../../../old-ui/app/components/bn-as-decimal-input'

describe('BnInput', function () {
  it('can tolerate a gas decimal number at a high precision', function (done) {

    let valueStr = '20'
    while (valueStr.length < 20) {
      valueStr += '0'
    }
    const value = new BN(valueStr, 10)

    const inputStr = '2.3'

    let targetStr = '23'
    while (targetStr.length < 19) {
      targetStr += '0'
    }
    const target = new BN(targetStr, 10)

    const precision = 18 // ether precision
    const scale = 18

    const onChange = (newBn) => {
      assert.equal(newBn.toString(), target.toString(), 'should tolerate increase')
      done()
    }

    const inputComponent = <BnInput {...{
      value,
      scale,
      precision,
      onChange,
    }}/>
    const component = additions.renderIntoDocument(inputComponent)
    TestRenderer.create(inputComponent)
    const input = additions.find(component, 'input.hex-input')[0]
    ReactTestUtils.Simulate.change(input, { preventDefault () {}, target: {
      value: inputStr,
      checkValidity () { return true } },
    })
  })

  it('can tolerate wei precision', function (done) {

    const valueStr = '1000000000'

    const value = new BN(valueStr, 10)
    const inputStr = '1.000000001'


    const targetStr = '1000000001'

    const target = new BN(targetStr, 10)

    const precision = 9 // gwei precision
    const scale = 9

    const inputComponent = <BnInput {...{
      value,
      scale,
      precision,
      onChange: (newBn) => {
        assert.equal(newBn.toString(), target.toString(), 'should tolerate increase')
        const reInput = this.downsize(newBn.toString(), 9, 9)
        assert.equal(reInput.toString(), inputStr, 'should tolerate increase')
        done()
      },
    }}/>

    const component = additions.renderIntoDocument(inputComponent)
    TestRenderer.create(inputComponent)
    const input = additions.find(component, 'input.hex-input')[0]
    ReactTestUtils.Simulate.change(input, { preventDefault () {}, target: {
      value: inputStr,
      checkValidity () { return true } },
    })
  })
})