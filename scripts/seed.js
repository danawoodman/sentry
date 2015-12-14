/**
 * Wipe and seed database with sample data.
 */
import chalk from 'chalk'
import connect from '../src/lib/mongo-connect'

const seed = async () => {

  const Membership = require('mongoose').model('Membership')
  const Account = require('mongoose').model('Account')

  console.log(chalk.green('Wiping DB'))

  // Wipe DB
  await Account.remove({})
  await Membership.remove({})

  console.log(chalk.green('Seeding DB'))

  // Create a default account
  await Account.create({})

  // Create some members
  await Membership.create({
    accessToken: 'aaa',
    active: true,
    availableCredits: 10,
    cobotId: 'a',
    name: 'Credit Person',
    plan: 'Day Use Member',
  })
  await Membership.create({
    accessToken: 'bbb',
    active: false,
    cobotId: 'b',
    name: 'Inactive Dude',
    plan: 'Day Use Member',
  })
  await Membership.create({
    accessToken: 'ccc',
    active: true,
    cobotId: 'c',
    name: 'Staff Lady',
    staff: true,
    plan: 'Staff Member',
  })
  await Membership.create({
    accessToken: 'ddd',
    active: true,
    cobotId: 'd',
    name: 'Unlimited Guy',
    unlimitedAccess: true,
    plan: 'Basic Member',
  })

  console.log(chalk.green('Wiped and seeded database!'))
  process.exit(0)
}

// Connect to mongo and then seed
connect()
  .on('error', console.error)
  .on('disconnected', connect)
  .once('open', seed)
