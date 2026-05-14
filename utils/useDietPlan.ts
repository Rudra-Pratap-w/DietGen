import { useUser } from "@clerk/expo";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useSupabaseClient } from "./supabase";

function getBaseUrl(): string {
  if (Platform.OS === "web") return "";
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    return `http://${debuggerHost}`;
  }
  return "";
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  title: string;
  subtitle: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface DietPlan {
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fats: number;
  meals: Meal[];
}

interface UseDietPlanReturn {
  dietPlan: DietPlan | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  regenerate: () => Promise<void>;
}

export function useDietPlan(): UseDietPlanReturn {
  const { user } = useUser();
  const supabase = useSupabaseClient();

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRITICAL: Prevent infinite loops
  const hasAttemptedFetch = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return null;
    const { data, error: fetchError } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError) return null;
    return Array.isArray(data) ? data[0] : data;
  }, [user, supabase]);

  const generateDietPlan = useCallback(
    async (profile: any): Promise<DietPlan | null> => {
      // Don't start if already generating
      if (generating) return null;

      try {
        setGenerating(true);
        setError(null);

        const baseUrl = getBaseUrl();
        const apiUrl = `${baseUrl}/api/generate-diet`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: profile.age,
            weight: profile.weight,
            height: profile.height,
            diet: profile.diet,
            allergy: profile.allergy,
            disease: profile.disease,
            region: profile.region,
          }),
        });

        const responseText = await response.text();

        if (!response.ok) {
          try {
            const errData = JSON.parse(responseText);
            throw new Error(errData.message || errData.error || "Quota Limit Reached");
          } catch {
            throw new Error(`Server Error: ${response.status}`);
          }
        }

        const data: DietPlan = JSON.parse(responseText);

        // Save to Supabase
        await supabase
          .from("profile")
          .update({
            target_calories: data.target_calories,
            target_protein: data.target_protein,
            target_carbs: data.target_carbs,
            target_fats: data.target_fats,
            ai_meal_plan: data.meals,
          })
          .eq("id", user!.id);

        return data;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setGenerating(false);
      }
    },
    [user, supabase, generating]
  );

  const loadDietPlan = useCallback(async (isManualRetry = false) => {
    if (hasAttemptedFetch.current && !isManualRetry) return;

    setLoading(true);
    hasAttemptedFetch.current = true;

    try {
      const profile = await fetchProfile();
      if (!profile) {
        setError("Profile not found");
        return;
      }

      // 1. Check for cached data
      if (profile.target_calories && profile.ai_meal_plan) {
        setDietPlan({
          target_calories: profile.target_calories,
          target_protein: profile.target_protein,
          target_carbs: profile.target_carbs,
          target_fats: profile.target_fats,
          meals: profile.ai_meal_plan,
        });
        return;
      }

      // 2. No cache - call AI
      const generated = await generateDietPlan(profile);
      if (generated) setDietPlan(generated);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, generateDietPlan]);

  const regenerate = useCallback(async () => {
    if (!user) return;
    setError(null);
    // Force allow a new fetch
    await supabase.from("profile").update({ ai_meal_plan: null }).eq("id", user.id);
    setDietPlan(null);
    await loadDietPlan(true); // true bypasses the ref check
  }, [user, supabase, loadDietPlan]);

  useEffect(() => {
    if (user && !hasAttemptedFetch.current) {
      loadDietPlan(false);
    }
  }, [user, loadDietPlan]);

  return { dietPlan, loading, generating, error, regenerate };
}