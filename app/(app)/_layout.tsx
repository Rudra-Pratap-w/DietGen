import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Layout = () => {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  if (!isLoaded)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="Green" />
      </SafeAreaView>
    );
  return (
    <Stack>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(TABS)" options={{ headerShown: false }} />
        <Stack.Screen name="/suggestion" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default Layout;
const styles = StyleSheet.create({});
