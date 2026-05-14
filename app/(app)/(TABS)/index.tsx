import { RefreshCcw } from "lucide-react-native";
import React from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDiet } from "../../../utils/DietContext";
import Navbar from "../components/Navbar";
import GeneratingScreen from "../components/ui/GeneratingScreen";
import Macros from "../components/ui/Macros";
import MealList from "../components/ui/MealList";
import ProgressCircle from "../components/ui/progressCircle";
import ProTip from "../components/ui/ProTip";
export default function Index() {
  const { dietPlan, loading, generating, error, consumed, consumedMeals, regenerate } = useDiet();

  if (error && !dietPlan && !generating) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center px-8">
        <Text className="text-5xl mb-6">⚠️</Text>
        <Text className="text-2xl font-bold text-slate-900 text-center mb-2">Could not load plan</Text>
        <Text className="text-slate-500 text-center mb-10 leading-6">{error}</Text>
        <TouchableOpacity
          onPress={() => regenerate()}
          className="w-full bg-[#0a7ea4] py-4 rounded-2xl shadow-lg active:opacity-90"
        >
          <Text className="text-white text-center font-bold text-lg">Try Again Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  if (loading || generating || !dietPlan) {
    return <GeneratingScreen />;
  }

  const remainingCalories = Math.max(0, dietPlan.target_calories - consumed.calories);
  const progress = Math.round(
    (consumed.calories / dietPlan.target_calories) * 100
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Interesting Premium Background: Heavy frosted glass effect over a vibrant fresh food image */}
      <View className="absolute top-0 left-0 right-0 bottom-0 z-[-1] overflow-hidden bg-white">
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop" }}
          className="absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-60"
          blurRadius={55}
          resizeMode="cover"
        />
        {/* Frosty white overlay to keep text completely readable while letting abstract colors bleed through */}
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#f8fafc]/80" />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading || generating}
            onRefresh={() => regenerate()}
            colors={["#0a7ea4"]}
            tintColor="#0a7ea4"
          />
        }
      >
        <View className="flex">
          <Navbar />
        </View>

        {/* Error banner */}
        {error && (
          <View className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <Text className="text-red-700 text-sm text-center">{error}</Text>
          </View>
        )}

        <View className="flex mt-20 justify-center items-center">
          <ProgressCircle progress={progress} value={remainingCalories} />
        </View>
        <View className="flex flex-row justify-center items-center">
          <Macros
            protein={dietPlan.target_protein}
            carbs={dietPlan.target_carbs}
            fats={dietPlan.target_fats}
            consumedProtein={consumed.protein}
            consumedCarbs={consumed.carbs}
            consumedFats={consumed.fats}
          />
        </View>
        <MealList meals={consumedMeals} />

        {/* Regenerate button */}
        <TouchableOpacity
          onPress={regenerate}
          className="mx-auto mt-6 bg-[#0a7ea4] px-6 py-3 rounded-full shadow-lg flex-row gap-4"
          activeOpacity={0.8}
        >
          <RefreshCcw color="white" size={20} />
          <Text className="text-white font-bold text-lg tracking-wide">
            Refresh Diet Plan
          </Text>
        </TouchableOpacity>

        <ProTip />
      </ScrollView>
    </SafeAreaView>
  );
}
