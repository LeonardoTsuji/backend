const axios = require("axios");

async function getFacebookUserData(accesstoken) {
  const { data } = await axios({
    url: "https://graph.facebook.com/me",
    method: "get",
    params: {
      fields: ["id", "email", "name"].join(","),
      access_token: accesstoken,
    },
  });
  console.log(data.error); // { id, email, first_name, last_name }
  return data;
}

module.exports = getFacebookUserData;
