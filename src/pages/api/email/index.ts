import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId, flight, userEmail, userName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: "nperezp@ucentral.edu.co",
      subject: `Confirmación de Reserva - ${bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
              }
              .header {
                text-align: center;
                padding: 20px 0;
                background-color: #1d4ed8;
                color: white;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px;
              }
              .booking-details {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: bold;
                color: #666;
              }
              .value {
                color: #333;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 0.9em;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Confirmación de Reserva</h1>
                <p>¡Hola ${userName}! Gracias por reservar con nosotros</p>
              </div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="label">Nombre:</span>
                  <span class="value">${userName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${userEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="label">ID de Reserva:</span>
                  <span class="value">${bookingId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Aerolínea:</span>
                  <span class="value">${flight.airline}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Categoría:</span>
                  <span class="value">${flight.category}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Hora de Salida:</span>
                  <span class="value">${flight.departureTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Hora de Llegada:</span>
                  <span class="value">${flight.arrivalTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Origen:</span>
                  <span class="value">${flight.origin}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Destino:</span>
                  <span class="value">${flight.destination}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pasajeros:</span>
                  <span class="value">${flight.passengers}</span>
                </div>
                 ${flight.hotelName ? `
                <div class="detail-row">
                  <span class="label">Hotel:</span>
                  <span class="value">${flight.hotelName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Estrellas del Hotel:</span>
                  <span class="value">${flight.hotelStars}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Noches en el Hotel:</span>
                  <span class="value">${flight.numberOfNights}</span>
                </div>
              ` : ''}
                <div class="detail-row">
                  <span class="label">Precio Total:</span>
                  <span class="value">${flight.price.toLocaleString()} COP</span>
                </div>
              </div>
              
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>© ${new Date().getFullYear()} FlyTickets. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
