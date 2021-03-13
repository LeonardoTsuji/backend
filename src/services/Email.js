const mailer = require("nodemailer");
const { resolve } = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = async ({ to, subject, text, variables }) => {
  let testAccount = await mailer.createTestAccount();

  const npsPath = resolve(__dirname, "..", "templates", "npsMail.hbs");
  const templateFileContent = fs.readFileSync(npsPath).toString("utf8");

  const mailTemplateParse = handlebars.compile(templateFileContent);

  const html = mailTemplateParse(variables);

  const smtpTransport = mailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, //SSL/TLS
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const mail = {
    to,
    from: "Premium Car <noreply@premiumcar.com.br>",
    subject,
    text,
    html,
  };

  return new Promise((resolve, reject) => {
    smtpTransport
      .sendMail(mail)
      .then((response) => {
        console.log("Message sent: %s", response.messageId);
        console.log("Preview URL: %s", mailer.getTestMessageUrl(response));
        smtpTransport.close();
        return resolve(response);
      })
      .catch((error) => {
        console.log(error, "error");
        smtpTransport.close();
        return reject(error);
      });
  });
};
