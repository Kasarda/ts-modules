const assert = require('assert')
const common = require('../common')

describe('Common', _ => {
    describe('getProgress', _ => {
        it('Simple test', done => {
            assert.equal(common.getProgress(0, 100, 50), .5)
            done()
        })

        it('Outside option', done => {
            assert.equal(common.getProgress(0, 100, 200, true), 2)
            done()
        })
    })

    describe('getValue', _ => {
        it('Simple test', done => {
            assert.equal(common.getValue(0, 100, .5), 50)
            done()
        })
    })

    describe('item', _ => {
        it('Positive index', done => {
            assert.equal(common.item([1, 2, 3], 1), 2)
            done()
        })
        it('Negative index', done => {
            assert.equal(common.item([1, 2, 3], -1), 3)
            done()
        })
    })

    describe('minmax', _ => {
        it('In range', done => {
            assert.equal(common.minmax(0, 100, 50), 50)
            done()
        })

        it('Overflow', done => {
            assert.equal(common.minmax(0, 100, 150), 100)
            done()
        })

        it('Underflow', done => {
            assert.equal(common.minmax(0, 100, -50), 0)
            done()
        })
    })

    describe('move', _ => {
        it('Move item', done => {
            assert.equal(common.move([1, 2, 3], 0, 1)[1], 1)
            done()
        })
    })
})

