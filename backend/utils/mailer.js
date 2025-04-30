import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // sesuaikan jika pakai lain
    auth: {
      user: process.env.EMAIL_USER, // isi dari .env
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"GPU ICT USK" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent
  });
};
