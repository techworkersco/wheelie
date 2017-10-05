'use strict'

const Team = require('../models/team')
const qs = require('querystring')
const invite = require('../buttons/invite')
const db = require('../util/mongo')
const User = require('../models/user').mongoUser
const addUser = require('../commands/addToMailchimp').addUser

const CHANNEL = process.env.SIGNUP_CHANNEL || 'admin-signups'

module.exports = path => server => server.post(path, signup)

function postUserToDb(params) {
  return db().then((db) => {
    const users = db.collection('users');
    return new Promise((resolve, reject) => {
      users.insert(new User(params), (err, result) => {
          if (err) {
            return reject(err)
          }
          resolve(result)
      })
    })
  })
}

function postUserToMailchimp(params) {
  return addUser(params).catch(err => {
    console.log('Error adding user to mailchimp')
    console.log(params)
    console.log(err)
  })
}

function postToSlack(params) {
  return Team.get(params.team_id).catch(() => {
    res.send(400, {error: 'team_not_found'})
    return next()
  }).then(team => (
    invite.prompt(team, CHANNEL, params)
  ))
}


function signup (req, res, next) {
  if (!req.body) { throw new Error('missing parameters') }
  const params = qs.parse(req.body)
  console.log('signup request:', params.team_id, params.email)
  console.log(params)
  
  
  postUserToDb(params)
    .then(() => {
      if (params.slack === 'on') {
        return postToSlack(params)
      } else {
        return Promise.resolve()
      }
    })
    .then(() => {
      if (params.newsletter === 'on') {
        postUserToMailchimp(params)
      }
      return Promise.resolve()
    })
    .then(() => {
      if (!params.redirect_uri) {
        res.send(200, 'signup request sent')
        next()
      } else {
        res.redirect(params.redirect_uri, next)
      }
    }).catch(err => {
      console.log(err)
      res.send(500, {
        msg: err.message
      })
      next()
    })
}
