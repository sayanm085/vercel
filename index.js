import express, { json, urlencoded } from 'express';
import { SMTPClient } from 'emailjs';
import cors from 'cors';
import emailTemplate from './emailTemplate.js';
import databaseconnection from './db/mongodb.js';

import emailModel from './db/email.model.js';


const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
const port = 3000;



app.get('/', (req, res) => {
    res.send('Hello World!'); // Default route
}); // Default route

// const transporter = nodemailer.createTransport({   // SMTP Configuration for Zoho Mail as email service provider

//     host: 'smtppro.zoho.in', // Zoho SMTP host
//     port: 465, // Zoho SMTP port
//     secure: true, // Use SSL/TLS for secure connections
//     auth: {
//         user: 'noreply@shotlin.com', // Replace with your email address
//         pass: 'bggEaS7G4vjV'
//     },
// });


const client = new SMTPClient({
	user: 'noreply@shotlin.com',
	password: 'bggEaS7G4vjV',
	host: 'smtppro.zoho.in',
	ssl: true,
});


  // const emailsend = (recipientEmail) => {
  //   const mailOptions = {
  //       from: 'Shotlin <noreply@shotlin.com>', // Sender's email address
  //       to: recipientEmail, // Recipient's email address
  //       subject: 'Thank you for your interest in our upcoming website!', // Email subject
  //       html: emailTemplate, // Email content in HTML format
  //   };

  //   transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //           console.error('Error sending email:', error);
  //           res.status(500).send('Error sending email');
  //       } else {
  //           console.log('Email sent:', info.messageId);   

  //           res.send('Email sent successfully!');   

  //       }
  //   });
  // }
  
  const emailjssend = async (recipientEmail) => {
    const message = await client.sendAsync({
      from: 'Shotlin <noreply@shotlin.com>',
      to: recipientEmail,
      subject: 'Thank you for your interest',
      attachment: [
        { data: emailTemplate , alternative: true },
      ],
    });
    console.log(message);
  };


// Send email route
// app.post('/api/send-email', async (req, res) => {
//   const { recipientEmail } = req.body;

//   try {
//     const emailfind = await emailModel.findOne({ email: recipientEmail }); // Using async/await for clarity

//     // Found existing email, send it
//     if (emailfind) {
//       emailsend(recipientEmail);
//       res.json('Email sent successfully ');
//       return; // Exit the function if email is found
//     }

//     // Create new email if not found
//     const newEmail = new emailModel({ email: recipientEmail });
//     await newEmail.save();

//     emailsend(recipientEmail);
//     res.json('Email sent successfully!' + recipientEmail);
//   } catch (error) {
//     console.error("Error while sending email:", error);
//     res.status(500).json('Error sending email');
//   }
// });

app.post('/api/send-email', async (req, res) => {
    const { recipientEmail } = req.body;
  
    try {
      const emailfind = await emailModel.findOne({ email: recipientEmail }); // Using async/await for clarity
  
      // Found existing email, send it
      if (emailfind) {
        emailjssend(recipientEmail);
        res.json('Email sent successfully ');
        return; // Exit the function if email is found
      }
  
      // Create new email if not found
      const newEmail = new emailModel({ email: recipientEmail });
      await newEmail.save();
  
      emailjssend(recipientEmail);
      res.json('Email sent successfully!' + recipientEmail);
    } catch (error) {
      console.error("Error while sending email:", error);
      res.status(500).json('Error sending email');
    }
  });








  databaseconnection()
  .then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port} `);
    });
  })
  .catch((error) => {
      res.status(500).send('Error connecting to database');
      process.exit(1);
  });


