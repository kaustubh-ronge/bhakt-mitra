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

  try {
    // Generate QR code data URL
    const qrCodeDataURL = await qr.toDataURL(JSON.stringify(data));

    // Email configuration
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

    // Send email with QR code attachment
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error.toString());
      }
      console.log('Email sent: ' + info.response);
      res.status(200).send('Form submitted and email sent successfully');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code or sending email');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
