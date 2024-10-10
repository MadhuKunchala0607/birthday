// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Birthday from './models/birthday.js'; // Ensure to use the .js extension
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(express.static('public')); // Serve static files from the public directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Route to add a birthday
app.post('/birthday', async (req, res) => {
    const { name, email, date } = req.body;

    try {
        const birthday = new Birthday({ name, email, date });
        await birthday.save();
        res.status(201).json(birthday);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get all birthdays
app.get('/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.status(200).json(birthdays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Function to send birthday emails
const sendBirthdayEmails = async () => {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    try {
        const birthdays = await Birthday.find();
        birthdays.forEach(async (birthday) => {
            const userBirthday = new Date(birthday.date);

            // Check if today's date matches the user's birthday
            if (todayDate.getMonth() === userBirthday.getMonth() && todayDate.getDate() === userBirthday.getDate()) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // You can use other email services
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: birthday.email,
                    subject: 'Happy Birthday!',
                    text: `Happy Birthday ${birthday.name}!`,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${birthday.email}`);
            }
        });
    } catch (error) {
        console.error('Error sending birthday emails:', error);
    }
};

// Call the sendBirthdayEmails function on server start (you may want to adjust this logic)
sendBirthdayEmails();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
