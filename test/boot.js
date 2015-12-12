import chai from 'chai'
import sinon from 'sinon'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))

// Alias some test helpers globally
global.mockReq = mockReq
global.mockRes = mockRes
global.expect = chai.expect
global.sinon = sinon

process.on('unhandledRejection', (err) => { throw err })
