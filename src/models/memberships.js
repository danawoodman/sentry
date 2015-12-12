import mongoose from 'mongoose'

const schema = new mongoose.Schema({

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
