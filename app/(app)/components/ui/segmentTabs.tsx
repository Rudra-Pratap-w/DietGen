import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const SegmentTabs = ({ activeTab, setActiveTab }: any) => {
  return (
    <View>
      {/* TAB BAR */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "weekly" && styles.activeTab]}
          onPress={() => setActiveTab("weekly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "weekly" && styles.activeText,
            ]}
          >
            7 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "monthly" && styles.activeTab]}
          onPress={() => setActiveTab("monthly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "monthly" && styles.activeText,
            ]}
          >
            30 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "alltime" && styles.activeTab]}
          onPress={() => setActiveTab("alltime")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "alltime" && styles.activeText,
            ]}
          >
            All Time
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1e5560",
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: "#76D2DB",
  },

  tabText: {
    color: "#9ad1b0",
    fontWeight: "500",
  },

  activeText: {
    color: "#003321",
    fontWeight: "bold",
  },
});
