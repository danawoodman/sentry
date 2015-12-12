import mongoose from 'mongoose'

const schema = new mongoose.Schema({

  cobotAccessToken: {
    type: String,
  },

}, { timestamps: true })

mongoose.model('Account', schema, 'accounts')
