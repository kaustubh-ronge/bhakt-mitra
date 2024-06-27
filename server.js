// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'bhaktmitra' directory
app.use(express.static(path.join(__dirname, 'bhaktmitra')));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, phoneNumber, email, subject, message } = req.body;

    // Example of using nodemailer to send an email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL, // Replace with your own email or process.env.EMAIL for testing
        subject: 'New Form Submission',
        text: `
            Name: ${name}
            Phone Number: ${phoneNumber}
            Email: ${email}
            Subject: ${subject}
            Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).send('Failed to submit form');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Form submitted successfully');
        }
    });
});

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bhaktmitra-master', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});