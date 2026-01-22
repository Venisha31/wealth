"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserTransactions } from "./transaction";

export async function getClusteringResults() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get user transactions
    const { data: transactions } = await getUserTransactions();

    if (!transactions || transactions.length === 0) {
      return { success: false, error: "No transactions found for clustering" };
    }

    // Serialize transactions for ML service
    const serializedTransactions = transactions.map(t => ({
      id: t.id,
      amount: t.amount.toNumber(),
      date: t.date.toISOString(),
      type: t.type,
      category: t.category,
      description: t.description,
    }));

    // Call ML service
    const response = await fetch("http://localhost:8000/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions: serializedTransactions }),
    });

    if (!response.ok) {
      throw new Error("Failed to get clustering results");
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}