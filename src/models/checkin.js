import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({

  accessToken: {
    type: String,
    required: true,
  },

  cobotId: {
    type: String,
  },

  memberId: {
    type: ObjectId,
  },

  memberName: {
    type: String,
  },

  memberPlan: {
    type: String,
  },

}, { timestamps: true })

mongoose.model('Checkin', schema, 'checkins')
