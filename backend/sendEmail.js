const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP server and app password
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail's SMTP service
  auth: {
    user: 'umairsalih2001@gmail.com', // Your Gmail address
    pass: 'kkwz myjc pyyw jmdw',        // App password (not your regular Gmail password)
  },
});

// Send an email
const sendEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: 'umairsalih2001@gmail.com',   // sender address
      to: 'recipient@example.com',       // list of receivers
      subject: 'Test Email',             // Subject line
      text: 'Hello world!',              // plain text body
      html: '<b>Hello world!</b>',       // HTML body content
    });
    console.log('Message sent: %s', info.messageId); // Log message ID after sending
  } catch (error) {
    console.error('Error sending email:', error); // Log any error that occurs
  }
};

// Call the sendEmail function to send an email
sendEmail();
