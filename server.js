const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const qr = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint to handle form submission
app.post('/submit', async (req, res) => {
  const { name, phoneNumber, email, subject, message } = req.body;
  const data = { name, phoneNumber, email, subject, message };

  try {
    // Generate QR code data URL
    const qrCodeDataURL = await qr.toDataURL(JSON.stringify(data));

    // Email configuration (replace with your actual email credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rongekaustubh@gmail.com',  // Your Gmail email address
        pass: 'Kdr@1161162004'   // Your Gmail password or App Password
      }
    });

    const mailOptions = {
      from: 'rongekaustubh@gmail.com',  // Sender's email address (could be same as user)
      to: 'mldevilff@gmail.com',    // Receiver's email address (your Gmail)
      subject: 'New Form Submission with QR Code',
      text: `Name: ${name}\nPhone: ${phoneNumber}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeDataURL.split(';base64,').pop(),  // Extract base64 data from QR code URL
          encoding: 'base64'
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
