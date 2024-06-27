const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const qr = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
  const { name, phoneNumber, email, subject, message } = req.body;
  const data = { name, phoneNumber, email, subject, message };
  const qrCodeDataURL = await qr.toDataURL(JSON.stringify(data));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'New Form Submission',
    text: `Name: ${name}\nPhone: ${phoneNumber}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    attachments: [
      {
        filename: 'qrcode.png',
        path: qrCodeDataURL
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Form submitted and email sent successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});