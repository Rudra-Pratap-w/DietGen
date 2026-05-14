import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

const PRO_TIPS = [
  {
    title: "Maximize Fat Burn with Morning Fiber",
    text: "Starting your day with 10g of fiber helps stabilize blood sugar and keeps you satiated until lunch. Try adding chia seeds to your morning bowl!",
    query: "healthy breakfast bowl"
  },
  {
    title: "Stay Hydrated for Better Digestion",
    text: "Drinking a glass of water 30 minutes before a meal can aid digestion. Don't forget your daily 8 glasses!",
    query: "water glass fresh"
  },
  {
    title: "Boost Immunity with Antioxidants",
    text: "Berries, pecans, and dark chocolate are high in antioxidants. Have them as a midday snack! Add colors to your life.",
    query: "berries mix"
  }

];

export default function ProTip() {
  const [tip] = useState(PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_IMAGE_API_KEY;
        if (!apiKey) return;

        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(tip.query)}&per_page=1`, {
          headers: {
            Authorization: apiKey
          }
        });

        const data = await res.json();
        if (data && data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.medium);
        }
      } catch (err) {
        console.error("Failed to fetch pro tip image", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [tip]);

  return (
    <View className="bg-emerald-50 rounded-3xl p-6 w-[92%] mb-16 mt-10 mx-auto shadow-xl shadow-emerald-900/10 elevation-8 border border-white relative overflow-hidden">
      <View className="absolute top-0 w-full h-full bg-emerald-100/30 rounded-3xl z-[-1]" />
      <View className="mb-4">
        <View className="bg-emerald-800 self-start px-3 py-1.5 rounded-full mb-4 shadow-sm shadow-emerald-900/20">
          <Text className="text-white text-[11px] font-extrabold tracking-widest">DIETGEN PRO TIP</Text>
        </View>
        <Text className="text-[22px] font-black text-emerald-950 mb-3 leading-tight tracking-tight">
          {tip.title}
        </Text>
        <Text className="text-emerald-800 text-sm leading-relaxed mb-4">
          {tip.text}
        </Text>

      </View>

      <View className="w-full h-48 bg-emerald-100 rounded-[24px] overflow-hidden justify-center items-center relative border border-emerald-50 shadow-inner">
        {loading ? (
          <ActivityIndicator color="#065f46" size="large" />
        ) : imageUrl ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Dark gradient overlay for a premium fade at the image bottom */}
            <View className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-emerald-950/20 to-transparent" />
          </>
        ) : (
          <Text className="text-emerald-700 font-medium">No Image Available</Text>
        )}
      </View>
    </View>
  );
}
