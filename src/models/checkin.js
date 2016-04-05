import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({

  cobotAccessToken: {
    type: String,
    required: true,
  },

  memberId: {
    type: ObjectId,
  },

}, { timestamps: true })

mongoose.model('Checkin', schema, 'checkins')
