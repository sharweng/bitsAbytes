const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  })

  // 2) Define the email options
  const mailOptions = {
    from: `Bits & Bytes <${process.env.SENDER_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments || [],
  }

  // 3) Send the email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
