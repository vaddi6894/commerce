const sendEmail = require("../utils/email");

exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `Contact Form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};
