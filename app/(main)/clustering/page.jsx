"use client";

import { useEffect, useState } from "react";
import { getClusteringResults } from "@/actions/clustering";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ClusteringPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await getClusteringResults();
        if (res.success) {
          setResults(res.data);
        } else {
          setError(res.error);
        }
      } catch (err) {
        setError("Failed to load clustering results");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) {
    return <div className="p-6">Loading spending behavior insights...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!results) {
    return <div className="p-6">No insights available</div>;
  }

  const { transactions, insights } = results;

  // Prepare data for scatter plot
  const timeBucketMap = { 'morning': 0, 'afternoon': 1, 'night': 2, 'late_night': 3 };
  const scatterData = transactions.map(t => ({
    x: timeBucketMap[t.time_bucket],
    y: t.amount_normalized,
    category: t.category,
    time_bucket: t.time_bucket,
    amount: t.amount,
    cluster_label: t.cluster_label,
    fill: t.cluster_label === "Routine Spending" ? "#8884d8" : t.cluster_label === "Discretionary / Impulse Spending" ? "#82ca9d" : "#ffc658"
  }));

  // Impulse expenses
  const impulseExpenses = transactions.filter(t => t.cluster_label === "Discretionary / Impulse Spending");

  // Spending style
  const spendingStyle = insights.impulse_percentage < 15 ? "Mostly planned with occasional impulse spending" :
                        insights.impulse_percentage > 30 ? "Frequent impulse spending detected" :
                        "Balanced spending with some impulse tendencies";

  // Time bias
  const timeBias = insights.weekend_percentage > 50 ? "You spend more during weekends" :
                   "You spend more during weekdays";

  // Habitual behavior
  const habitualBehavior = `${insights.habitual_percentage.toFixed(0)}% of your spending follows monthly routines`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Spending Behavior Insights</h1>
        <p className="text-muted-foreground">How and when you tend to spend money</p>
      </div>

      {/* Section 1: Behavior Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Spending Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{spendingStyle}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Impulse Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={insights.impulse_percentage} className="mb-2" />
            <p className="text-sm">{insights.impulse_percentage.toFixed(0)}% of your expenses are impulsive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">When You Spend Most</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{timeBias}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Habitual Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{habitualBehavior}</p>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Spending Behavior Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Behavior Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Time of Day" tickFormatter={(value) => Object.keys(timeBucketMap)[value]} />
              <YAxis type="number" dataKey="y" name="Normalized Amount" />
              <Tooltip
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Time: ${Object.keys(timeBucketMap)[label]}`}
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded">
                        <p>Category: {data.category}</p>
                        <p>Time: {data.time_bucket}</p>
                        <p>Amount: ${data.amount.toFixed(2)}</p>
                        <p>Behavior: {data.cluster_label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Section 3: Impulse Spending Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Impulse Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impulseExpenses.slice(0, 10).map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>${t.amount.toFixed(2)}</TableCell>
                  <TableCell>{t.time_bucket}</TableCell>
                  <TableCell><Badge variant="destructive">Impulse</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 4: Time-Based Heatmap - Simplified as a table for now */}
      <Card>
        <CardHeader>
          <CardTitle>Time-Based Spending Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Heatmap visualization (placeholder - implement with appropriate library if needed)</p>
          {/* Placeholder for heatmap */}
        </CardContent>
      </Card>

      {/* Section 5: Explainability Panel */}
      <Card>
        <CardHeader>
          <CardTitle>How are these insights calculated?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Spending patterns detected automatically from your transaction history</li>
            <li>Habits identified using frequency and timing of expenses</li>
            <li>Unusual behavior flagged when it deviates from your routine</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}