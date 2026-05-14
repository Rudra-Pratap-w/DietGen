import React, { createContext, useCallback, useContext, useState } from "react";
import { DietPlan, Meal, useDietPlan } from "./useDietPlan";

interface ConsumedTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DietContextType {
  dietPlan: DietPlan | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  regenerate: () => Promise<void>;
  consumedMeals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (index: number) => void;
  clearConsumed: () => void;
  consumed: ConsumedTotals;
  isMealConsumed: (mealTitle: string) => boolean;
}

const DietContext = createContext<DietContextType | null>(null);

export function DietProvider({ children }: { children: React.ReactNode }) {
  const { dietPlan, loading, generating, error, regenerate } = useDietPlan();
  const [consumedMeals, setConsumedMeals] = useState<Meal[]>([]);

  const addMeal = useCallback((meal: Meal) => {
    setConsumedMeals((prev) => {
      // Filter out any existing meal of the same type
      const filtered = prev.filter((m) => m.type !== meal.type);
      return [...filtered, meal];
    });
  }, []);

  const removeMeal = useCallback((index: number) => {
    setConsumedMeals((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearConsumed = useCallback(() => {
    setConsumedMeals([]);
  }, []);

  const isMealConsumed = useCallback(
    (mealTitle: string) => {
      return consumedMeals.some((m) => m.title === mealTitle);
    },
    [consumedMeals]
  );

  const consumed: ConsumedTotals = {
    calories: consumedMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
    protein: consumedMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
    carbs: consumedMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
    fats: consumedMeals.reduce((sum, m) => sum + (m.fats || 0), 0),
  };

  return (
    <DietContext.Provider
      value={{
        dietPlan,
        loading,
        generating,
        error,
        regenerate,
        consumedMeals,
        addMeal,
        removeMeal,
        clearConsumed,
        consumed,
        isMealConsumed,
      }}
    >
      {children}
    </DietContext.Provider>
  );
}

export function useDiet(): DietContextType {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error("useDiet must be used within a DietProvider");
  }
  return context;
}
