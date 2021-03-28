const mailer = require("nodemailer");
const { resolve } = require("path");
const hbs = require("nodemailer-express-handlebars");
const sgTransport = require("nodemailer-sendgrid-transport");

const options = {
  auth: {
    api_key: process.env.SENDGRID_PASSWORD,
  },
};

var client = mailer.createTransport(sgTransport(options));

client.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".html", // handlebars extension
      layoutsDir: resolve(__dirname, "..", "templates"), // location of handlebars templates
      defaultLayout: null,
      partialsDir: resolve(__dirname, "..", "templates"), // location of your subtemplates aka. header, footer etc
    },
    viewPath: resolve(__dirname, "..", "templates"),
    extName: ".html",
  })
);

module.exports = client;
