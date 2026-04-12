import { useSSO } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          // Handle session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            const url = decorateUrl("/") as Href;
            router.push(url);
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border-2 border-gray-200 py-4 shadow-md rounded-2xl mt-4"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-center gap-3">
        <Ionicons name="logo-google" size={20} color="#EA4335" />
        <Text className="text-gray-700 font-semibold text-lg  text-center">
          Sign in with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
}
