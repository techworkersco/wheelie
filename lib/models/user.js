'use strict'

const slack = require('slack')
const bluebird = require('bluebird')
const users = bluebird.promisifyAll(slack.users)
const Team = require('./team')

module.exports.get = (team, userId) => {
  let teamP
  if (typeof team === 'string') {
    teamP = Team.get(team)
  } else {
    teamP = bluebird.resolve(team)
  }
  return teamP.then(t => (
    users.infoAsync({
      token: t.access_token,
      user: userId
    }).then(res => res.user))
  )
}

module.exports.mongoUser = class User {
  constructor (params) {
    this.name = params.name
    this.company_name = params.company_name
    this.email = params.email
    this.social_media_links = [params.social_media_1, params.social_media_2]
    this.referrer = params.referrer
  }
}
