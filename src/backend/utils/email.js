import nodemailer from 'nodemailer';

// Create a transporter using SMTP (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail' or custom SMTP host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
export async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}
