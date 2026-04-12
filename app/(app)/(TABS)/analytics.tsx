import Analytics from "@/features/analytics/Analytics";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SegmentTabs } from "../components/ui/segmentTabs";
const analytics = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  return (
    <SafeAreaView>
      <View className="mx-2 mt-4">
        <SegmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      <Analytics range={activeTab} />
    </SafeAreaView>
  );
};

export default analytics;

const styles = StyleSheet.create({});
