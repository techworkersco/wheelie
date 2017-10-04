'use strict'

module.exports = (callbackId, token, channel, user) => {
  return {
    token,
    channel: channel,
    text: 'New Signup!',
    attachments: [{
      title: user.email,
      fields: [{
        title: 'Social Media Link',
        value: user.social_media_1,
        short: true
      }, {
        title: 'Social Media Link',
        value: user.social_media_2,
        short: true
      }, {
        title: 'Company Name',
        value: user.company_name,
        short: true
      }, {
        title: 'Referrer',
        value: user.referrer,
        short: true
      }],
      author_name: user.name,
      author_icon: 'https://api.slack.com/img/api/homepage_custom_integrations-2x.png'
    },
    {
      title: 'Would you like to invite this person?',
      callback_id: callbackId,
      color: '#3AA3E3',
      attachment_type: 'default',
      actions: [{
        name: 'invite',
        text: 'Invite',
        type: 'button',
        value: user.email
      }, {
        name: 'no',
        text: 'No',
        type: 'button',
        value: ''
      }]
    }]
  }
}
