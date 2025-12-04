import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  // -------- MONTHLY REPORT TEMPLATE -------- //
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here’s your financial summary for {data?.month}:
            </Text>

            {/* MAIN STATS */}
            <Section style={styles.statsContainer}>
              <Row>
                <Column>
                  <Text style={styles.label}>Total Income</Text>
                  <Text style={styles.value}>
                    ${data?.stats?.totalIncome ?? 0}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.label}>Total Expenses</Text>
                  <Text style={styles.value}>
                    ${data?.stats?.totalExpenses ?? 0}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text style={styles.label}>Net</Text>
                  <Text style={styles.value}>
                    $
                    {(data?.stats?.totalIncome ?? 0) -
                      (data?.stats?.totalExpenses ?? 0)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CATEGORY BREAKDOWN */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.sectionTitle}>Expenses by Category</Heading>

                {Object.entries(data.stats.byCategory).map(
                  ([category, amount]) => (
                    <Row style={styles.row} key={category}>
                      <Column>
                        <Text style={styles.text}>{category}</Text>
                      </Column>
                      <Column style={{ textAlign: "right" }}>
                        <Text style={styles.text}>${amount}</Text>
                      </Column>
                    </Row>
                  )
                )}
              </Section>
            )}

            {/* INSIGHTS */}
            {data?.insights?.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.sectionTitle}>Welth Insights</Heading>
                {data.insights.map((insight, i) => (
                  <Text key={i} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Welth. Stay in control of your finances!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // -------- BUDGET ALERT TEMPLATE -------- //
  return (
    <Html>
      <Head />
      <Preview>Budget Alert</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>Budget Alert</Heading>

          <Text style={styles.text}>Hello {userName},</Text>
          <Text style={styles.text}>
            You’ve used {data?.percentageUsed ?? 0}% of your monthly budget.
          </Text>

          <Section style={styles.statsContainer}>
            <Row>
              <Column>
                <Text style={styles.label}>Budget Amount</Text>
                <Text style={styles.value}>${data?.budgetAmount ?? 0}</Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={styles.label}>Spent So Far</Text>
                <Text style={styles.value}>${data?.totalExpenses ?? 0}</Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={styles.label}>Remaining</Text>
                <Text style={styles.value}>
                  ${(data?.budgetAmount ?? 0) - (data?.totalExpenses ?? 0)}
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "6px",
    width: "100%",
    maxWidth: "520px",
  },
  title: {
    fontSize: "28px",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "20px",
  },
  text: {
    fontSize: "15px",
    color: "#4b5563",
    marginBottom: "12px",
  },
  section: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "12px",
    color: "#1f2937",
  },
  statsContainer: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#6b7280",
  },
  value: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: "4px",
  },
  row: {
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
    marginTop: "24px",
  },
};
