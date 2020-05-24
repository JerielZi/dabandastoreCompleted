const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4be55ca829b967",
    pass: "2fb9abb59d5852"
  }
});