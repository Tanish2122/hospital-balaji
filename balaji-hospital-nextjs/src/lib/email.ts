import nodemailer from "nodemailer";

export interface ConsultationEmailData {
  patientName: string;
  phone: string;
  treatment: string;
  source?: string;
  submittedAt?: string;
}

const DEFAULT_RECIPIENT = "balajihospjprinsurance@gmail.com";

/**
 * Creates nodemailer transporter using environment variables or fallback SMTP settings
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || "";
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";

  if (!user || !pass) {
    console.warn(
      "[Email Utility] Warning: SMTP credentials (SMTP_USER/GMAIL_USER & SMTP_PASS/GMAIL_APP_PASSWORD) are not set in environment variables. Email notification will be logged."
    );
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    }),
    user,
    pass,
  };
}

/**
 * Sends consultation popup form details to balajihospjprinsurance@gmail.com
 */
export async function sendConsultationEmail(data: ConsultationEmailData) {
  const recipientEmail = process.env.NOTIFICATION_EMAIL || DEFAULT_RECIPIENT;
  const timestamp = data.submittedAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  console.log(`[Email Utility] Preparing to send Free Consultation notification to: ${recipientEmail}`);
  console.log(`[Email Utility] Details:`, {
    patientName: data.patientName,
    phone: data.phone,
    treatment: data.treatment,
    source: data.source || "Website Popup Form",
    timestamp,
  });

  const { transporter, user, pass } = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #0bc5bf 0%, #0891b2 100%); color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
          .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.25); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 8px; }
          .content { padding: 28px; }
          .detail-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .detail-table td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .detail-table td.label { font-weight: 600; color: #64748b; width: 35%; background-color: #f8fafc; }
          .detail-table td.value { color: #0f172a; font-weight: 500; }
          .footer { background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          .call-btn { display: inline-block; margin-top: 20px; background: #0891b2; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Balaji Hospital & Orthopaedic Centre</h1>
            <p>New Consultation Request Received</p>
            <div class="badge">Popup Form Inquiry</div>
          </div>
          <div class="content">
            <p style="font-size: 15px; margin-bottom: 20px; color: #334155;">
              A patient has submitted their details through the <strong>Free Consultation Popup Form</strong> on the website:
            </p>
            <table class="detail-table">
              <tr>
                <td class="label">Patient Name</td>
                <td class="value"><strong>${data.patientName}</strong></td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value"><a href="tel:${data.phone}" style="color: #0891b2; text-decoration: none; font-weight: bold;">${data.phone}</a></td>
              </tr>
              <tr>
                <td class="label">Treatment Required</td>
                <td class="value">${data.treatment}</td>
              </tr>
              <tr>
                <td class="label">Request Source</td>
                <td class="value">${data.source || "Website Popup Form"}</td>
              </tr>
              <tr>
                <td class="label">Submission Time</td>
                <td class="value">${timestamp} IST</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 25px;">
              <a href="tel:${data.phone}" class="call-btn">📞 Call Patient Now (${data.phone})</a>
            </div>
          </div>
          <div class="footer">
            Automated notification from Balaji Hospital Website &bull; Sent to ${recipientEmail}
          </div>
        </div>
      </body>
    </html>
  `;

  if (!user || !pass) {
    console.log(
      `[Email Utility] Notice: SMTP credentials not set. Email body generated for ${recipientEmail}:`,
      `Patient: ${data.patientName}, Phone: ${data.phone}, Treatment: ${data.treatment}`
    );
    return {
      success: true,
      simulated: true,
      message: "Notification processed (SMTP credentials missing in .env.local)",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Balaji Hospital Popup" <${user}>`,
      to: recipientEmail,
      subject: `🚨 New Free Consultation Request: ${data.patientName} (${data.treatment})`,
      text: `New Free Consultation Request:\nPatient Name: ${data.patientName}\nPhone: ${data.phone}\nTreatment: ${data.treatment}\nSubmitted At: ${timestamp}`,
      html: htmlContent,
    });

    console.log(`[Email Utility] Email successfully sent to ${recipientEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Email Utility] Failed to send email via SMTP:`, err);
    return { success: false, error: err.message };
  }
}
