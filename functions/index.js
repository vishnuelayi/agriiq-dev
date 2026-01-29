const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agriiqedu@gmail.com",
    pass: "Agriiq@909",
  },
});

exports.notifyAdminOnPayment = functions.firestore
  .document("payments/{paymentId}")
  .onCreate(async (snap) => {
    const data = snap.data();

    await transporter.sendMail({
      from: "AgriIQ <agriiqedu@gmail.com>",
      to: "admin@agriiq.com",
      subject: "New Payment Submitted",
      text: `
User ID: ${data.userId}
Exam ID: ${data.examId}
Transaction ID: ${data.transactionId}
      `,
    });
  });
