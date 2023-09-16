import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: "alexindevs@gmail.com",
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
          },
      });
    
      const mailOptions = {
            from: 'alexindevs@gmail.com',
            to,
            subject,
            html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
  