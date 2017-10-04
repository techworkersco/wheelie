'use strict'

const Team = require('../models/team')
const qs = require('querystring')
const invite = require('../buttons/invite')
const db = require('../util/mongo')
const User = require('../models/user').mongoUser

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
  //add as record in mongolab
  const exec = [
    postUserToDb(params),
  ];
  
  if (params.slack) {
    exec.push(postToSlack(params))
  }

  Promise.all(exec)  
    .then(() => {
      if (!params.redirect_uri) {
        res.send(200, 'signup request sent')
        next()
      } else {
        res.redirect(params.redirect_uri, next)
      }
    }).catch(err => {
      res.send(500, {
        msg: err.message
      })
      next()
    })
}
