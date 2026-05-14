import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,

    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
      },
      global: {
        fetch: async (url, options = {}) => {
          let token;
          try {
            token = await getToken({ template: "supabase" });
          } catch (err) { }
          if (!token) token = await getToken();

          return fetch(url as RequestInfo, {
            ...options,
            headers: {
              ...(options.headers || {}),
              apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        },
      },
    },
  );
  return supabase;
};
