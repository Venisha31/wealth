"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import axios from "axios";

export async function getUserBehaviorInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get internal user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Fetch user transactions
  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      status: "COMPLETED",
    },
    orderBy: { date: "asc" },
  });

  // Call Python ML service
  const response = await axios.post(
    "http://localhost:8000/cluster",
    { transactions }
  );

  return response.data;
}
