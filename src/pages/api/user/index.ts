import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: number;
  name: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {

      //Email 
      const userWithEmail = await db.user.findFirst({
        where: {
          email,
        },
      });

      if (userWithEmail?.email === email) {
        return res.status(400).json("There's a existing user with this email");
      }

      //Password
      if (!password || password.length < 6) {
        return res
          .status(400)
          .json("The password must be at least 6 characters");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(200).json(newUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
