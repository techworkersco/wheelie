const Mailchimp = require('mailchimp-api-v3')

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

module.exports.postToMailchimp = function(userInformation) {
  console.log('Posting to mailchimp')
  return mailchimp.post('/lists/243735091b/members', {
    email_address: userInformation.email,
    status: 'subscribed',
    merge_fields: {
      MMERGE3: userInformation.company_name,
      MMERGE6: userInformation.name
    }
  })
  .catch(err => {
    console.log('Error adding user to mailchimp')
    console.log(params)
    console.log(err)
  })
}
