import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, booking } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: "nperezp@ucentral.edu.co",
      subject: 'Reservación cancelada',
      html: `
        <h2>Tu reservación ha sido cancelada</h2>
        <p>Detalles de la reservación:</p>
        <ul>
          <li>Aerolínea: ${booking.airline}</li>
          <li>Origen: ${booking.origin}</li>
          <li>Destino: ${booking.destination}</li>
          <li>Fecha: ${new Date(booking.startDate).toLocaleDateString()}</li>
        </ul>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
