import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const STEPS = [
  { emoji: "📊", label: "Analyzing your profile..." },
  { emoji: "🧬", label: "Calculating your macros..." },
  { emoji: "🍽️", label: "Crafting personalized meals..." },
  { emoji: "✨", label: "Finalizing your plan..." },
];

export default function GeneratingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    const dotLoop = Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    dotLoop.start();
    return () => dotLoop.stop();
  }, [dotAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, fadeAnim, slideAnim]);

  const step = STEPS[currentStep];

  return (
    <View style={styles.container}>
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />
      <View style={[styles.bgCircle, styles.bgCircle3]} />

      <Animated.Text
        style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}
      >
        {step.emoji}
      </Animated.Text>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.label}>{step.label}</Text>
      </Animated.View>

      <Text style={styles.subtitle}>
        DietGen AI is personalizing everything for you
      </Text>

      <View style={styles.dotsContainer}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index <= currentStep ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf8",
    padding: 32,
  },
  bgCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.15,
  },
  bgCircle1: {
    width: 300,
    height: 300,
    backgroundColor: "#0a7ea4",
    top: -50,
    right: -80,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    backgroundColor: "#10b981",
    bottom: 100,
    left: -60,
  },
  bgCircle3: {
    width: 150,
    height: 150,
    backgroundColor: "#f59e0b",
    bottom: -30,
    right: -20,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  label: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: "#0a7ea4",
  },
  dotInactive: {
    backgroundColor: "#cbd5e1",
  },
});
