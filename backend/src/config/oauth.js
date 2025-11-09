/**
 * OAuth Configuration
 * FatSecret API OAuth 1.0a setup
 */

const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const oauth = OAuth({
  consumer: {
    key: process.env.FATSECRET_KEY,
    secret: process.env.FATSECRET_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

module.exports = { oauth };










