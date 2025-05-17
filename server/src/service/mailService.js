import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, //add this into .env - perhaps in the script aswell.
    pass: process.env.MAILTRAP_PASS
  }
})

transporter.verify((error, success) =>{
    if(error){
        console.log("smtp error", error)
    } else {
        console.log("smtp up and running, redy to send mail")
    }
})

//will probably need to refactor this later but we will see
const sendResetEmail = async (to, token) => {
  const resetLink = `https://linuxlearningplatform.me/reset-password?token=${token}`

  const mailOptions = {
    from: '"LXLP Support" <linuxlearningplatform@gmail.com>',
    to,
    subject: 'Reset password',
    html: `
      <p>Hello!</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>The link is valid for 15 minutes.</p>
    `
  }

  console.log("sending mail to", to)
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(" Mail sent:", info)
  } catch (err) {
    console.error(" error when calling sendMail:", err.message)
    console.error(err)
  }
}

export default sendResetEmail
