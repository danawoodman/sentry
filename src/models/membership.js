import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({

  accessToken: {
    type: String,
  },

  accountId: {
    type: ObjectId,
  },

  active: {
    default: false,
    type: Boolean,
  },

  availableCredits: {
    default: null,
    type: Number,
  },

  cobotId: {
    type: String,
  },

  name: {
    default: 'unnamed',
    type: String,
  },

  plan: {
    type: String,
  },

  staff: {
    default: false,
    type: Boolean,
  },

  unlimitedAccess: {
    default: false,
    type: Boolean,
  },

}, { timestamps: true })

mongoose.model('Membership', schema, 'memberships')
