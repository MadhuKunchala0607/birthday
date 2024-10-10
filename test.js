const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Test email function
async function sendTestEmail() {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'madhkunchala@gmail.com', // Replace with your own email address
        subject: 'Test Email',
        text: 'This is a test email from Nodemailer!',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendTestEmail();
