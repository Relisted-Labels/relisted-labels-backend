import nodemailer from 'nodemailer';

const emailPass = process.env.EMAIL_PASS || 'OPxNtKJ6U1y9sc5Y';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        debug: true,
        port: 587,
        auth: {
            user: "d1cd79de37311b",
            pass: "9f4fe0fb2d5483",
        },
        tls: {
            rejectUnauthorized: false,
          },
      });

      console.log("Everything's good till here.")
    
      const mailOptions = {
            from: 'alexindevs@gmail.com',
            to,
            subject,
            html,
      };
      console.log("Before suspect:")
      const info = await transporter.sendMail(mailOptions);
      console.log("After suspect.")
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
  