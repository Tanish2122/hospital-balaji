import nodemailer from 'nodemailer';

async function testMail() {
  const host = "smtp.gmail.com";
  const port = 465;
  const user = "balajihospjprinsurance@gmail.com";
  const pass = "wyupxanqezkyaehz"; // without spaces

  console.log("Testing email connection with SMTP_USER:", user);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });

  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✓ SMTP Server Connection Successful!");

    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: `"Balaji Hospital Website" <${user}>`,
      to: "balajihospjprinsurance@gmail.com, balajihospital072@gmail.com",
      subject: "✅ Test Email Notification from Website",
      text: "This is a test notification confirming that email sending is working properly!",
      html: "<h2 style='color:#0891b2;'>Balaji Hospital Website</h2><p>This is a test email confirming that automated notifications for popup forms and inquiries are fully working!</p>",
    });

    console.log("✓ Test Email Sent Successfully! Message ID:", info.messageId);
  } catch (err: any) {
    console.error("❌ SMTP Error:", err.message);
  }
}

testMail();
