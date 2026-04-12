import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics({ range }: any) {
  let labels;
  let data;
  let title = "";

  if (range === "weekly") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    data = [1200, 1700, 1500, 1400, 1800, 2100, 1600];
    title = "Weekly Analytics";
  }

  if (range === "monthly") {
    labels = ["W1", "W2", "W3", "W4"];
    data = [1500, 1800, 1700, 2000];
    title = "Monthly Analytics";
  }

  if (range === "alltime") {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    data = [1400, 1600, 1900, 1700, 2000, 2100];
    title = "All Time Analytics";
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Net Calories</Text>
        <Text style={styles.big}>1,840 kcal</Text>

        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: [1200, 1700, 1500, 1400, 1800, 2100, 1600],
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "black",
            backgroundGradientTo: "#1e5560",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(118,210,219,${opacity})`,
            labelColor: () => "#9ad1b0",
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <Text style={styles.smallTitle}>Calories Burned</Text>
          <Text style={styles.smallValue}>450 kcal</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallTitle}>Average Intake</Text>
          <Text style={styles.smallValue}>2,150 kcal</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallTitle}>Current Weight</Text>
          <Text style={styles.smallValue}>72.5 kg</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallTitle}>Water Intake</Text>
          <Text style={styles.smallValue}>2.4 L</Text>
        </View>
      </View>

      <View style={styles.predictionCard}>
        <Text style={styles.predictionTitle}>Weekly Prediction</Text>
        <Text style={styles.predictionText}>On track for 0.5kg loss</Text>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.weightRow}>Current: 72.5kg Target: 72kg</Text>
      </View>

      <View style={styles.macroCard}>
        <Text style={styles.predictionTitle}>Macronutrient Trends</Text>

        <Text style={styles.macroLabel}>Protein 124g / 140g</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "88%" }]} />
        </View>

        <Text style={styles.macroLabel}>Carbs 180g / 200g</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "90%" }]} />
        </View>

        <Text style={styles.macroLabel}>Fats 45g / 65g</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "70%" }]} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    display: "flex",
    backgroundColor: "white",
    padding: 20,
  },

  header: {
    color: "#355872",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1e5560",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  title: {
    color: "#9ad1b0",
    fontSize: 14,
  },

  big: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  chart: {
    borderRadius: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "#1e5560",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  smallTitle: {
    color: "#9ad1b0",
    fontSize: 12,
  },

  smallValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },

  predictionCard: {
    backgroundColor: "#1e5560",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  predictionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  predictionText: {
    color: "#9ad1b0",
    marginBottom: 10,
  },

  progressBar: {
    height: 8,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    width: "75%",
    backgroundColor: "#76D2DB",
  },

  weightRow: {
    color: "#9ad1b0",
    fontSize: 12,
  },

  macroCard: {
    backgroundColor: "#1e5560",
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
  },

  macroLabel: {
    color: "#9ad1b0",
    marginTop: 10,
  },
});
