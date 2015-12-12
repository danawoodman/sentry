/**
 * Wipe and seed database with sample data.
 */
import chalk from 'chalk'
import mongoose from 'mongoose'
import connect from '../src/lib/mongo-connect'
import bootstrapModels from '../src/lib/bootstrap-models'

// Load up all the mongoose schemas.
bootstrapModels()

const Membership = mongoose.model('Membership')
const Account = mongoose.model('Account')

const seed = async () => {

  // Wipe DB
  await Account.where({}).remove()
  await Membership.where({}).remove()

  // Create a default account
  await Account.create({})

  // Create some members
  await Membership.create({
    accessToken: 'aaa',
    active: true,
    availableCredits: 10,
    cobotId: 'a',
    name: 'Credit Person',
  })
  await Membership.create({
    accessToken: 'bbb',
    active: false,
    cobotId: 'b',
    name: 'Inactive Dude',
  })
  await Membership.create({
    accessToken: 'ccc',
    active: true,
    cobotId: 'c',
    name: 'Staff Lady',
    staff: true,
  })
  await Membership.create({
    accessToken: 'ddd',
    active: true,
    cobotId: 'd',
    name: 'Unlimited Guy',
    unlimitedAccess: true,
  })

  console.log(chalk.green('Wiped and seeded database!'))
  process.exit(0)
}

// Connect to mongo and then seed
connect()
  .on('error', console.error)
  .on('disconnected', connect)
  .once('open', seed)
