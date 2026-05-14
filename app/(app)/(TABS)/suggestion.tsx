import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDiet } from "../../../utils/DietContext";
import { Meal } from "../../../utils/useDietPlan";

export default function SuggestionScreen() {
  const { dietPlan, loading, generating, error, consumedMeals, addMeal, removeMeal, isMealConsumed, regenerate } =
    useDiet();

  if (error && !dietPlan && !generating) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 }}>Plan Loading Failed</Text>
        <Text style={{ color: '#64748b', textAlign: 'center', marginHorizontal: 32, marginBottom: 24 }}>{error}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => regenerate()}
          className="px-8 py-3 rounded-xl"
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Retry Generation</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading || generating || !dietPlan) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading your meal plan...</Text>
      </SafeAreaView>
    );
  }

  const renderMealCard = ({ item }: { item: Meal }) => {
    const isConsumed = isMealConsumed(item.title);
    const consumedIndex = consumedMeals.findIndex(
      (m) => m.title === item.title
    );

    const itemType = item.type || item.title;
    const emoji =
      itemType === "Breakfast"
        ? "🌅"
        : itemType === "Lunch"
          ? "☀️"
          : "🌙";

    return (
      <View
        style={[
          styles.card,
          isConsumed ? styles.cardConsumed : styles.cardDefault,
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>{item.title}</Text>
              <Text style={styles.mealSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          <View style={styles.calorieBadge}>
            <Text style={styles.calorieText}>{item.calories}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
        </View>

        {/* Macro breakdown */}
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: "#FF6B6B" }]} />
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{item.protein || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: "#4D96FF" }]} />
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{item.carbs || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: "#FFD93D" }]} />
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={styles.macroValue}>{item.fats || 0}g</Text>
          </View>
        </View>

        {/* Add / Remove button */}
        <TouchableOpacity
          style={[styles.actionBtn, isConsumed ? styles.removeBtn : styles.addBtn]}
          onPress={() => {
            if (isConsumed) {
              removeMeal(consumedIndex);
            } else {
              addMeal(item);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>
            {isConsumed ? "✓  Added to Today — Tap to Remove" : "+  Add to Today's Log"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Calculate consumed totals for the summary bar
  const consumedCals = consumedMeals.reduce((s, m) => s + m.calories, 0);

  const currentHour = new Date().getHours();
  let currentMealType = "Dinner"; // 5 PM to 4:59 AM
  if (currentHour >= 5 && currentHour < 12) {
    currentMealType = "Breakfast"; // 5 AM to 11:59 AM
  } else if (currentHour >= 12 && currentHour < 17) {
    currentMealType = "Lunch"; // 12 PM to 4:59 PM
  }

  // Fallback for older cached plans where type might be missing
  const filteredMeals = dietPlan.meals.filter((item) => {
    const itemType = item.type || item.title;
    return itemType === currentMealType;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>AI Meal Suggestions</Text>
        <Text style={styles.pageSubtitle}>
          Currently showing options for {currentMealType}
        </Text>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.summaryLabel}>Logged Today</Text>
          <Text style={styles.summaryValue}>
            {consumedCals} / {dietPlan.target_calories} kcal
          </Text>
        </View>
        <View style={styles.summaryCount}>
          <Text style={styles.summaryCountText}>
            {consumedMeals.length} meals logged
          </Text>
        </View>
      </View>

      {/* Meal cards */}
      <FlatList
        data={filteredMeals}
        renderItem={renderMealCard}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf8",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf8",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  headerSection: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e5560",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  summaryCount: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryCountText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardDefault: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
  cardConsumed: {
    backgroundColor: "#ecfdf5",
    borderColor: "#6ee7b7",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 32,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  mealSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
    flexShrink: 1,
  },
  calorieBadge: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  calorieText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0a7ea4",
  },
  calorieUnit: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  macroItem: {
    alignItems: "center",
    gap: 4,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#0a7ea4",
  },
  removeBtn: {
    backgroundColor: "#10b981",
  },
  actionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
