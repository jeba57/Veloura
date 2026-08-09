import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "Lumière Salon <onboarding@resend.dev>";

const send = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not configured. Email skipped.");
      return;
    }
    if (!to) {
      console.warn(`Email skipped for "${subject}" — no recipient.`);
      return;
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("Email sending failed:", error);
      return;
    }

    console.log("Email sent:", data?.id);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

export const sendNewBookingAdminEmail = async ({ booking, service, customer }) => {
  await send({
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New Booking Request - ${service.name}`,
    html: `
      <h2>New Booking Request</h2>
      <p>A new booking has been received at Lumière Salon.</p>

      <p><strong>Customer:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone || "Not provided"}</p>
      <p><strong>Service:</strong> ${service.name}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Time:</strong> ${booking.timeSlot}</p>

      <p>Please open the admin dashboard to review and confirm the booking.</p>
    `,
  });
};

export const sendBookingConfirmedEmail = async ({ booking, service, customer }) => {
  await send({
    to: customer.email,
    subject: "Your Lumière Salon Booking is Confirmed",
    html: `
      <h2>Booking Confirmed ✨</h2>

      <p>Hi ${customer.name},</p>

      <p>Your booking at Lumière Salon has been confirmed.</p>

      <p><strong>Service:</strong> ${service.name}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Time:</strong> ${booking.timeSlot}</p>

      <p>We look forward to seeing you!</p>

      <p>— Lumière Salon</p>
    `,
  });
};

export const sendBookingRejectedEmail = async ({ booking, service, customer }) => {
  await send({
    to: customer.email,
    subject: "Update on Your Lumière Salon Booking",
    html: `
      <h2>Booking Update</h2>

      <p>Hi ${customer.name},</p>

      <p>Unfortunately, your booking request could not be confirmed.</p>

      <p><strong>Service:</strong> ${service.name}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Time:</strong> ${booking.timeSlot}</p>

      ${booking.rejectionReason ? `<p><strong>Reason:</strong> ${booking.rejectionReason}</p>` : ""}

      <p>Please choose another available slot.</p>

      <p>— Lumière Salon</p>
    `,
  });
};
