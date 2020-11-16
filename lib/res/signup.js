"use strict";

const Team = require("../models/team");
const qs = require("querystring");
const invite = require("../buttons/invite");

const CHANNEL = process.env.SIGNUP_CHANNEL || "admin-signups";

module.exports = (path) => (server) => server.post(path, signup);

function postToSlack(params) {
  return Team.get(params.team_id)
    .catch(() => {
      res.send(400, { error: "team_not_found" });
      return next();
    })
    .then((team) => invite.prompt(team, CHANNEL, params));
}

function signup(req, res, next) {
  if (!req.body) {
    throw new Error("missing parameters");
  }
  const params = qs.parse(req.body);
  console.log("signup request:", params.team_id, params.email);
  console.log(params);

  postToSlack(params)
    .then(() => {
      if (!params.redirect_uri) {
        res.send(200, "signup request sent");
        next();
      } else {
        console.log("About to redirect");
        res.redirect(params.redirect_uri, next);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(500, {
        msg: err.message,
      });
      next();
    });
}
