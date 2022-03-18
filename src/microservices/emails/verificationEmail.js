const transporter = require("../../services/nodemailer");

module.exports = function verification(mail) {
  const mailData = {
    from: "find.spot.ar.co@gmail.com", // sender address
    to: mail, // list of receivers
    subject: "Verifica tu cuenta",
    text: "Verifica tu cuenta",
    html: `<br> Haz click aqui para verificar tu cuenta<br/> <a href="https://find-spot.herokuapp.com/verify?id=${mail}&mail=${mail}" >Verificar</a>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log("Email error");
    else console.log("Email send");
  });
};
