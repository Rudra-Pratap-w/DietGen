import { useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabaseClient } from "../../../utils/supabase";

interface Profile {
  email_id?: string;
  username?: string;
  age?: number;
  height?: number;
  weight?: number;
  allergy?: string;
  region?: string;
  diet?: string;
  disease?: string;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const supabase = useSupabaseClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error fetching profile:", error.message);
    } else {
      const fetchedData = Array.isArray(data) ? data[0] : data;
      setProfile(fetchedData);
      setEditedProfile(fetchedData);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!user || !editedProfile) return;
    setSaving(true);

    // Convert numeric strings back to numbers if needed
    const payload = { ...editedProfile };
    if (payload.age) payload.age = Number(payload.age);
    if (payload.height) payload.height = Number(payload.height);
    if (payload.weight) payload.weight = Number(payload.weight);

    const { error } = await supabase
      .from("profile")
      .update(payload)
      .eq("id", user.id);

    if (error) {
      console.log("Error updating profile:", error.message);
    } else {
      setProfile(payload);
      setIsEditing(false);
    }
    setSaving(false);
  };

  const renderField = (
    label: string,
    fieldKey: keyof Profile,
    placeholder: string = "Not set",
    suffix: string = "",
  ) => {
    const isNumeric =
      fieldKey === "age" || fieldKey === "height" || fieldKey === "weight";
    return (
      <>
        <Text className="text-gray-600 text-lg mb-1 mt-2">{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedProfile?.[fieldKey]?.toString() || ""}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile!, [fieldKey]: text })
            }
            placeholder={placeholder}
            placeholderTextColor="#888"
            keyboardType={isNumeric ? "numeric" : "default"}
          />
        ) : (
          <Text style={styles.item}>
            {profile?.[fieldKey]
              ? `${profile[fieldKey]}${suffix}`
              : placeholder}
          </Text>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }
  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile data found</Text>
        <Button title="Retry" onPress={fetchProfile} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} className="m-5 rounded-xl flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1"
      >
        <View className="mx-4 gap-4 text-bold text-2xl rounded-lg">
          <View className="flex-col items-center mb-5 text-bold text-2xl p-6 rounded-lg relative">
            <TouchableOpacity
              onPress={isEditing ? handleSave : handleEditToggle}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                backgroundColor: isEditing ? "#0a7ea4" : "#355872",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                zIndex: 10,
              }}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {isEditing ? "Save" : "Edit"}
                </Text>
              )}
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                onPress={handleEditToggle}
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  backgroundColor: "#DB1A1A",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  zIndex: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}

            <Image
              source={{ uri: user?.imageUrl }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                backgroundColor: "#355872",
                marginTop: 15,
              }}
            />
            <Text style={styles.title}>{user?.firstName || "User"}</Text>
            <Text style={styles.subtitle}>{profile.email_id}</Text>
          </View>
          <View style={{ margin: 4 }}>
            <View style={styles.fieldtitle}>
              <Ionicons name="person" size={28} color="black" />
              <Text style={styles.headingText}>Personal Info</Text>
            </View>
            <View className="flex-col mb-4">
              {renderField("Full Name", "username")}
              {renderField("Email", "email_id")}
              {renderField("Age", "age")}
            </View>

            <View style={styles.fieldtitle}>
              <Ionicons name="body" size={28} color="black" />
              <Text style={styles.headingText}>Physical Details</Text>
            </View>
            <View className="flex-col mb-4">
              {renderField("Height", "height", "Not set", " cm")}
              {renderField("Weight", "weight", "Not set", " kg")}
            </View>

            <View style={styles.fieldtitle}>
              <Ionicons name="nutrition" size={28} color="black" />
              <Text style={styles.headingText}>Health & Diet</Text>
            </View>
            <View className="flex-col mb-4">
              {renderField("Diet", "diet")}
              {renderField("Allergy", "allergy")}
              {renderField("Disease", "disease")}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginTop: 40,
  },
  fieldtitle: {
    marginBottom: 10,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "900",
    color: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Manrope-Bold",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
    color: "gray",
  },

  item: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
    backgroundColor: "#BED4CB",
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  input: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BED4CB",
    padding: 10,
    borderRadius: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
