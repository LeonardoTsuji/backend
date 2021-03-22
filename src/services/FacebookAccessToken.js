const axios = require("axios");

async function getAccessTokenFromCode(code) {
  try {
    const { data } = await axios({
      url: "https://graph.facebook.com/v4.0/oauth/access_token",
      method: "get",
      params: {
        client_id: process.env.FACEBOOK_ID,
        client_secret: process.env.FACEBOOK_SECRET,
        redirect_uri: "http://localhost:3000/auth/facebook/",
        code,
      },
    });
    console.log(data); // { access_token, token_type, expires_in }
    return data.access_token;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = getAccessTokenFromCode;
