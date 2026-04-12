import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import Macros from "../components/ui/Macros";
import MealList from "../components/ui/MealList";
import ProgressCircle from "../components/ui/progressCircle";
export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex">
          <Navbar />
        </View>
        <View className="flex mt-20 justify-center items-center">
          <ProgressCircle progress={69} value={1500} />
        </View>
        <View className="flex flex-row justify-center items-center">
          <Macros />
        </View>
        <MealList />
      </ScrollView>
    </SafeAreaView>
  );
}
