import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Handle GET request - fetch bookings
        res.status(200).json({ message: "Get bookings" });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
      }
      break;

    case "POST":
      try {
        // Handle POST request - create booking
        const {
          id,
          airline,
          category,
          departureTime,
          arrivalTime,
          origin,
          destination,
          passengers,
          startDate,
          endDate,
          hotelName,
          numberOfNights,
          price,
          userId,
        } = req.body;

        if (
          !id ||
          !airline ||
          !category ||
          !startDate ||
          !endDate ||
          !departureTime ||
          !arrivalTime ||
          !origin ||
          !destination ||
          !passengers ||
          !price ||
          !userId
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const booking = await db.booking.create({
          data: {
            id,
            airline,
            category,
            startDate,
            endDate,
            departureTime,
            arrivalTime,
            origin,
            destination,
            passengers,
            hotelName,
            numberOfNights,
            price,
            userId: userId,
          },
        });

        res.status(201).json(booking);
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
