import React from "react";
import Container from "@/components/ui/Container";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Best Hospital in Jaipur | Balaji Hospital",
  description: "Get in touch with Balaji Hospital & Orthopaedic Centre, Jaipur. Contact us at +91 7276229049 for 24/7 emergency care, trauma, or appointments.",
  keywords: ["hospital contact jaipur", "emergency number jaipur hospital", "balaji hospital location", "orthopedic clinic jaipur address"],
};

const ContactPage = () => {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Contact Us
            </h1>
            <p className="text-lg text-slate-600">
              We are here to help you 24/7. Reach out to us for appointments or emergency care.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-poppins">Send Us a Message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-poppins">Contact Info</h2>

            <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-medical-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-medical-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Call Today</div>
                <div className="text-xl font-bold text-slate-900">+91 7276229049</div>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Email Us</div>
                <div className="text-xl font-bold text-slate-900">info@balajihospitaljaipur.com</div>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Open Hours</div>
                <div className="text-xl font-bold text-slate-900">24*7 Available</div>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Our Location</div>
                <address className="text-slate-900 font-bold not-italic">
                  27, Ratan Nagar, Dher Ke Balaji, Sikar Road, Jaipur, Rajasthan. 302039
                </address>
                <p className="text-xs text-red-600 font-bold mt-2 uppercase tracking-tight italic">
                  Note: We do not have any branches anywhere else.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
          <iframe
            src="https://www.google.com/maps?q=Balaji+Hospital+%26+Orthopaedic+Center+Jaipur"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Container>
    </main>
  );
};

export default ContactPage;
