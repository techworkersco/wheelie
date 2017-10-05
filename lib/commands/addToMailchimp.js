const Mailchimp = require('mailchimp-api-v3')
 
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

module.exports.addUser = function(userInformation) {
  return mailchimp.post('/lists/7cb85d276a/members', {
    email_address: userInformation.email,
    status: 'subscribed',
    merge_fields: {
      MMERGE3: userInformation.company_name,
      MMERGE6: userInformation.name
    }
  })
}
