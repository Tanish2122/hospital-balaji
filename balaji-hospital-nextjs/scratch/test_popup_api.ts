import { sendConsultationEmail } from '../src/lib/email';

async function testPopupEmail() {
  console.log("Testing sendConsultationEmail from Popup Form submission...");
  const res = await sendConsultationEmail({
    patientName: "Test Patient (Popup)",
    phone: "9876543210",
    treatment: "Orthopedic Surgery",
    source: "Free Consultation Popup Form",
  });
  console.log("Result:", res);
}

testPopupEmail();
