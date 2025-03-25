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
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        const bookings = await db.booking.findMany({
          where: {
            userId: String(userId),
          },
          orderBy: {
            startDate: 'desc'
          }
        });

        res.status(200).json(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
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

    case "DELETE":
      try {
        const { bookingId } = req.query;

        if (!bookingId) {
          return res.status(400).json({ message: "Booking ID is required" });
        }

        await db.booking.delete({
          where: {
            id: String(bookingId),
          },
        });

        res.status(200).json({ message: "Booking deleted successfully" });
      } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Failed to delete booking" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
