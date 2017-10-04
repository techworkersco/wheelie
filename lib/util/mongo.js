const mongo = require('mongodb')
const bluebird = require('bluebird')

const url = process.env.MONGOLAB_BRONZE_URI;
console.log(url)
bluebird.promisifyAll(mongo.MongoClient.prototype)


module.exports = () => mongo.MongoClient.connect(url)
