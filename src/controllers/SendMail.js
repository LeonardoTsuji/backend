const { User } = require("../models");
const mailer = require("../services/Email");

exports.sendUserEmail = async (req, template) => {
  const { email, subject, text } = req.body;

  await User.findOne({ where: { email } })
    .then(async function (res) {
      const responseMail = await mailer.sendMail({
        to: email,
        from: "leonardo_tsuji@hotmail.com",
        subject: subject,
        context: {
          ...req.body,
        },
        template,
      });
    })
    .catch(function (err) {
      console.log(err, "err");
    });
};
