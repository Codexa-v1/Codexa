import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
    if (!to) throw new Error('Recipient email is required');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,      // your Gmail
            pass: process.env.EMAIL_PASS,      // your Gmail app password
        },
    });

    const info = await transporter.sendMail({
        from: `"PlanIt" <${process.env.EMAIL_USER}>`,
        to,       // must be string or array of strings
        subject,
        html,
    });

    console.log('Email sent:', info.messageId);
}
