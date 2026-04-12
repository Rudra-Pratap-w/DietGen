import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/expo";
import { useSupabaseClient } from "../../../utils/supabase";
const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View className="flex flex-row justify-center w-full items-center gap-1 min-w-[112px] min-h-14 mt-4 overflow-hidden">
        <Ionicons name={icon} size={20} color={focused ? "#0a7ea4" : "gray"} />
        <Text className=" text-[#355872] font-semibold">{title}</Text>
      </View>
    );
  } else {
    return (
      <View className="flex flex-row justify-center w-full items-center gap-1 min-w-[112px] min-h-14 mt-4 overflow-hidden">
        <Ionicons name={icon} size={20} color={focused ? "#6366f1" : "gray"} />
      </View>
    );
  }
};
const layout = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkProfile = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("id")
          .eq("id", user.id)
          .single();
        if (isMounted) {
          if (data && (!Array.isArray(data) || data.length > 0)) {
            setHasProfile(true);
          } else {
            setHasProfile(false);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setHasProfile(false);
          setLoading(false);
        }
      }
    };
    
    checkProfile();
    return () => { isMounted = false; };
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!hasProfile) {
    return <Redirect href="/(app)/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon="home-outline" title="Home" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon
                focused={focused}
                icon="analytics-outline"
                title="Analytics"
              />
            </>
          ),
        }}
      />

      <Tabs.Screen
        name="suggestion"
        options={{
          title: "Suggestion",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon
                focused={focused}
                icon="bulb-outline"
                title="Suggestion"
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon
                focused={focused}
                icon="person-outline"
                title="Profile"
              />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default layout;

const styles = StyleSheet.create({});
