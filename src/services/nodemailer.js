const nodemailer = require("nodemailer");

const { MAIL } = process.env;

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "find.spot.ar.co@gmail.com",
    pass: MAIL,
  },
  secure: true,
});

module.exports = transporter;
