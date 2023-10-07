const { AuthenticationClient } = require('auth0');

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  redirectUri: `${process.env.PROJECT_URL}api/v1/auth/apple/callback`,
});

module.exports = auth0;