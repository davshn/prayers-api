const transporter = require("../../services/nodemailer");

module.exports = function verification(mail) {
  const mailData = {
    from: "find.spot.ar.co@gmail.com", 
    to: mail, 
    subject: "Verifica tu cuenta",
    text: "Verifica tu cuenta",
    html: `<br> Haz click aqui para verificar tu cuenta<br/> <a href="https://find-spot.herokuapp.com/verify?id=${mail}&mail=${mail}" >Verificar</a>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log("Error al enviar el correo");
    else console.log("Correo enviado con exito");
  });
};
//heroku logs --tail -a prayers-app