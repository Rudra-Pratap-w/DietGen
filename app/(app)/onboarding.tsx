import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabaseClient } from "../../utils/supabase";

export default function ProfileSetup() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useSupabaseClient();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    allergy: "",
    disease: "",
    region: "",
    diet: "veg",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  const validateStep = () => {
    if (step === 1) {
      if (!form.name || !form.age) {
        return false;
      }
    }

    if (step === 2) {
      if (!form.weight || !form.height) {
        return false;
      }
    }

    if (step === 4) {
      if (!form.region) {
        return false;
      }
    }

    return true;
  };
  const nextStep = () => {
    if (step < 4 && form != null) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.log("User not found");
      return;
    }

    const { error } = await supabase.from("profile").upsert({
      id: user.id,
      email_id: user.primaryEmailAddress?.emailAddress,
      username: form.name,
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      allergy: form.allergy,
      diet: form.diet,
      disease: form.disease,
      region: form.region,
    });

    if (error) {
      console.log("Error saving profile:", error.message);
    } else {
      console.log("Profile saved successfully!");
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-3xl font-bold mb-4 justify-center text-center text-gray-700">
        Hello, {form.name || "User"}!
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        Let's set up your profile to get personalized diet suggestions.
      </Text>
      {/* Progress */}
      <Text style={styles.progress}>Step {step} of 4</Text>

      {/* Step Content */}
      {step === 1 && (
        <View>
          <Text style={styles.title}>Basic Info</Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
          />

          <TextInput
            placeholder="Age"
            style={styles.input}
            keyboardType="numeric"
            value={form.age}
            onChangeText={(v) => handleChange("age", v)}
          />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.title}>Body Details</Text>

          <TextInput
            placeholder="Weight (kg)"
            style={styles.input}
            keyboardType="numeric"
            value={form.weight}
            onChangeText={(v) => handleChange("weight", v)}
          />

          <TextInput
            placeholder="Height (cm)"
            style={styles.input}
            keyboardType="numeric"
            value={form.height}
            onChangeText={(v) => handleChange("height", v)}
          />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.title}>Health Info</Text>

          <TextInput
            placeholder="Allergy (e.g. peanuts)"
            style={styles.input}
            value={form.allergy}
            onChangeText={(v) => handleChange("allergy", v)}
          />

          <TextInput
            placeholder="Disease (e.g. diabetes)"
            style={styles.input}
            value={form.disease}
            onChangeText={(v) => handleChange("disease", v)}
          />
        </View>
      )}

      {step === 4 && (
        <View>
          <Text style={styles.title}>Preferences</Text>

          <TextInput
            placeholder="Region (e.g. North India)"
            style={styles.input}
            value={form.region}
            onChangeText={(v) => handleChange("region", v)}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.option, form.diet === "veg" && styles.selected]}
              onPress={() => handleChange("diet", "veg")}
            >
              <Text>Veg</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                form.diet === "non-veg" && styles.selected,
              ]}
              onPress={() => handleChange("diet", "non-veg")}
            >
              <Text>Non-Veg</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
            <Text className="text-white ">Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={validateStep() ? styles.nextBtn : styles.nextBtnDisabled}
          onPress={nextStep}
          disabled={!validateStep() || !isLoaded}
        >
          <Text style={{ color: "#fff" }}>
            {step === 4 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    marginBottom: 50,
  },
  progress: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    justifyContent: "center",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#0a7ea4",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backBtn: {
    padding: 12,
    backgroundColor: "black",
    borderRadius: 8,
  },
  nextBtn: {
    padding: 12,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
  },
  nextBtnDisabled: {
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});
