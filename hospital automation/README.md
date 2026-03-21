# Advanced WhatsApp Hospital Appointment Automation

This is an advanced, production-ready WhatsApp bot for hospital management, running locally on your PC.

## 🚀 Quick Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Doctors**:
   Open `src/config.js` and update the `phone` fields with actual WhatsApp numbers (including country code, e.g., `919876543210@c.us`).
3. **Run the Bot**:
   ```bash
   node src/index.js
   ```
4. **Scan QR Code**: Scan the terminal QR code with your WhatsApp.

## 🛠️ Configuration
You can customize the following in `src/config.js`:
- **Departments**: Add or remove hospital departments.
- **Doctors**: Assign doctors to departments with their WhatsApp numbers.
- **Slots**: Define the time slots available for booking.

## 📂 Features
- **Emergency Flow**: Collects patient info and reports, then alerts the doctor.
- **Normal Flow**: Dynamic slot selection and booking confirmation.
- **Media Handling**: Automatically downloads and stores patient reports in `uploads/`.
- **Doctor Alerts**: Sends automated WhatsApp messages to doctors for every new booking or emergency.

## 📊 Database
Data is stored in `hospital_advanced.db` (SQLite). You can use any SQLite browser to view appointments and emergency requests.

## 📁 Storage
All uploaded medical reports are saved in the `uploads/` directory with a timestamp for easy tracking.
