"use server";

import { getUserBehaviorInsights } from "@/actions/behavior";

export default async function BehaviorPage() {
  try {
    const data = await getUserBehaviorInsights();

    return (
      <pre className="p-4 bg-gray-100 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  } catch (err: any) {
    console.error("BehaviorPage error:", err);
    return <div className="p-4 text-red-600">Error: {err.message}</div>;
  }
}
