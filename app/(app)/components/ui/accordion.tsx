import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, type, children }: any) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen(!open);
  };

  return (
    <View
      style={{
        backgroundColor: "#1e5560",
        borderRadius: 12,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        style={{
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Ionicons name={type} size={20} color="white" style={{ margin: 15 }} />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {title}
        </Text>
        <Text style={{ color: "#aaa", fontSize: 18 }}>{open ? "−" : "+"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={{ padding: 15, backgroundColor: "#2a2a40" }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
