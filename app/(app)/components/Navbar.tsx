import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Navbar = () => {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center bg-white px-4 py-3 rounded-xl">
      <Text className="text-2xl font-bold text-[#355872]">
        Hi! {user?.firstName || "User"}
      </Text>

      <View className="flex-row items-center gap-3">
        {isSignedIn ? (
          <>
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-10 h-10 rounded-full"
            />

            <TouchableOpacity
              onPress={() => signOut()}
              className="bg-[#DB1A1A] px-3 py-2 rounded-md"
            >
              <Text className="text-white text-bold text-lg">Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            className="bg-[#355872] px-3 py-2 rounded-md"
          >
            <Text className="text-white text-bold text-lg">Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Navbar;
