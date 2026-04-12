import { useAuth, useSignUp } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>Verify your account</Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <Text style={styles.error}>{errors.fields.code.message}</Text>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              fetchStatus === "fetching" && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={styles.secondaryButtonText}>I need a new code</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="justify-center ">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gradient-to-br from-green-700 to to-black rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Image
                source={require("../../assets/images/dgg.png")}
                style={{ width: 80, height: 80 }}
              />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Join DietGen
            </Text>
            <Text className="text-lg text-gray-500 text-center">
              Be a part of our community and start your personalized diet
              journey today!
            </Text>
          </View>
        </View>
        {/*Header Section*/}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <Text className="text-2xl font-extrabold text-[#0a7ea4] mb-6 text-center">
            Create your account
          </Text>
          <View className="flex flex-col">
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#666666"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              keyboardType="email-address"
            />
            {errors.fields.emailAddress && (
              <Text style={styles.error}>
                {errors.fields.emailAddress.message}
              </Text>
            )}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#666666"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            {errors.fields.password && (
              <Text style={styles.error}>{errors.fields.password.message}</Text>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                (!emailAddress || !password || fetchStatus === "fetching") &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                !emailAddress || !password || fetchStatus === "fetching"
              }
              className="flex flex-row bg-black py-3 rounded-md mt-4 justify-center px-4"
              activeOpacity={0.7}
            >
              {" "}
              <View className="flex-row items-center justify-center gap-3">
                {" "}
                {fetchStatus === "fetching" ? (
                  <Ionicons name="refresh" size={20} color="white" />
                ) : (
                  <Ionicons name="person-add" size={20} color="white" />
                )}
                <Text className="text-white font-medium">Sign up</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
              <Text>Already have an account?</Text>
              <Link href="/sign-in">
                <Text className="text-green-600 font-medium">Sign In</Text>
              </Link>
            </View>
          </View>
        </View>

        {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
        <View nativeID="clerk-captcha" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "green",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  error: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});
