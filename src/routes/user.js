const { Router } = require("express");

const router = Router();

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try{
    const categories= await searchCategory(req.body.interests);
    const newUser= await User.create({
      dateOfBirth: req.body.dateOfBirth,
      name: req.body.name,
      profilePic: req.body.profilePic,
      email: req.body.email.toLowerCase(),
      password: await bcrypt.hash(req.body.password, salt),
    })
    newUser.addCategory(categories);
    
    const mailData = {
      from: 'find.spot.ar.co@gmail.com',  // sender address
      to: newUser.email,   // list of receivers
      subject: 'Verifica tu cuenta',
      text: 'Verifica tu cuenta',
      html: `<br> Haz click aqui para verificar tu cuenta<br/> <a href="https://find-spot.herokuapp.com/verify?id=${newUser.verificationCode}&mail=${newUser.email}" >Verificar</a>`,
    };

    transporter.sendMail(mailData, function (err, info) {
      if(err)
        console.log("Email error")
      else
        console.log("Email send");
      });

    res.status(200).send("User created!");
  } catch (error) {
    res.status(400).send("Error in creation");
  }
});

module.exports = router;