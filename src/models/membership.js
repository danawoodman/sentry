import mongoose from 'mongoose'

const schema = new mongoose.Schema({

  accessToken: {
    type: String,
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
