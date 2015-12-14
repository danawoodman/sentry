//#!/usr/bin/env node

import chalk from 'chalk'
import connect from '../src/lib/mongo-connect'
import updateMemberships from '../src/lib/update-memberships'

const sync = async () => {
  const Account = require('mongoose').model('Account')

  console.log(chalk.gray('Starting sync of memberships'))

  try {

    // Update memberships for every account in the system.
    const accounts = await Account.where({})

    console.log(chalk.gray(`Updating memberships for ${accounts.length} accounts`))

    //const memberships = await* accounts.map(async (a) => await updateMemberships(a))
    let updatedCount = 0
    for (let account of accounts) {
      const memberships = await updateMemberships(account)
      updatedCount += memberships.length

      console.log(chalk.gray(`Updated ${memberships.length} memberships for ${account.id}`))
    }

    console.log(chalk.green(`Updated ${updatedCount} memberships`))

    process.exit()
  } catch(err) {
    console.log(chalk.red('Error syncing memberships:'), err.message, err.stack)
    process.exit(1)
  }
}

// Connect to mongo and then seed
connect()
  .on('error', console.error)
  .on('disconnected', connect)
  .once('open', sync)
