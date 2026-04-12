import { useSignIn } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Image,
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
import GoogleAuth from "./components/GoogleAuth";
export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }
    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/");
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/");
    } else {
      console.log("Verification not complete:", signIn.status);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
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
              <Text>Verify</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => signIn.mfa.sendEmailCode()}
            >
              <Text style={styles.secondaryButtonText}>I need a new code</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        {/*Header Section*/}
        <View className="justify-center ">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gradient-to-br from-green-700 to to-black rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Image
                source={require("../../assets/images/dgg.png")}
                style={{ width: 80, height: 80 }}
              />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              DietGen
            </Text>
            <Text className="text-lg text-gray-500 text-center">
              Your personal diet generator.{"\n"} Get personalized meal plans
              and recipes
            </Text>
          </View>
        </View>
        {/*Header Section*/}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <Text className="text-2xl font-extrabold text-[#0a7ea4] mb-6 text-center">
            Welcome Back!
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
            {errors.fields.identifier && (
              <Text style={styles.error}>
                {errors.fields.identifier.message}
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
                  <Ionicons name="log-in" size={20} color="white" />
                )}
                <Text className="text-white font-medium">Login</Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-400 text-md">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>
            <GoogleAuth />
            <View style={styles.linkContainer}>
              <Text>Don't have an account? </Text>
              <Link href="/sign-up">
                <Text className="text-green-600 font-medium">Sign up</Text>
              </Link>
            </View>
          </View>
        </View>
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
    color: "#fff",
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
