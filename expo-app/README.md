# TripSplit — Expo Onboarding

A complete, production-style onboarding flow for React Native (Expo / Expo Go), mirroring the
TripSplit web landing page story — **travel together → split smarter → settle up → plan the
journey → remember it** — and themed entirely with your **APEX design-system tokens**
(`theme/index.ts`). Dark `midnight` background, gold accents, green = money coming to you,
rose = money you owe, SpaceMono for amounts, Bricolage Grotesque for display type.

Works on all screen sizes: content is measured with `useWindowDimensions`, capped at a max
width for tablets, and scaled down for short phones. Honors the system **Reduce Motion**
setting.

## 1. Drop-in structure

Copy the `src/onboarding` folder into your project so it sits next to your `theme/` folder:

```
your-app/
├── theme/
│   └── index.ts            ← your APEX design system (already exists)
└── src/
    └── onboarding/         ← copy this folder
        ├── OnboardingScreen.tsx
        ├── theme-context.tsx   (imports ../../theme — adjust if your path differs)
        ├── index.ts
        ├── data/slides.tsx
        ├── lib/format.ts · lib/hooks.ts
        └── components/
            ├── icons.tsx · primitives.tsx
            ├── RouteBackground.tsx · PagerDots.tsx
            └── visuals/ Plan · Split · Settle · Itinerary · Memory
```

## 2. Install dependencies

```bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-svg \
  expo-linear-gradient expo-blur expo-haptics expo-font \
  @react-native-async-storage/async-storage react-native-safe-area-context \
  @expo-google-fonts/bricolage-grotesque @expo-google-fonts/space-mono
```

Then add the Reanimated Babel plugin **last** in `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

## 3. Usage

```tsx
// App.tsx
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen, { ONBOARDED_STORAGE_KEY } from "./src/onboarding";
// import { lightTheme } from "./theme"; // ← pass for light mode
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_STORAGE_KEY).then((v) => setOnboarded(v === "1"));
  }, []);

  if (onboarded === null) return null; // splash
  if (!onboarded) {
    return (
      <OnboardingScreen
        // theme={lightTheme as any}   // optional: light mode
        onFinish={() => setOnboarded(true)}
        // onLogin={() => navigation.navigate("Login")}  // optional override
      />
    );
  }
  return <HomeScreen />;
}
```

## 4. Props

| Prop       | Type         | Default                                                    |
| ---------- | ------------ | ---------------------------------------------------------- |
| `theme`    | `Theme`      | `darkThemeObj` from your APEX tokens                       |
| `onFinish` | `() => void` | called on Skip / complete; also persists the storage flag  |
| `onLogin`  | `() => void` | overrides CTAs; default opens `https://trip-split-zeta-taupe.vercel.app/login` via `Linking` |

The login URL and storage key live in `src/onboarding/lib/format.ts` — change them in one place.

## 5. What's inside the flow

1. **Travel together** — live Bali trip dashboard with counting totals, crew avatars, group
   balance and floating expense chips (Hotel / Dinner / Taxi).
2. **Split smarter** — interactive ₹4,800 dinner demo with an **Equal ↔ Custom** toggle and
   animated share bars that always balance.
3. **Settle up** — final balances collapse into 3 transfers with animated dashed money flow
   and a "✓ SETTLED" stamp.
4. **Plan the journey** — London → Paris → Amsterdam itinerary timeline with travel segments
   and a 62% planning progress bar.
5. **Remember it** — year-in-review stats (count-ups), achievement badges and the trip
   leaderboard, ending in **Create Your First Trip / Log in** CTAs.

Ambient scene behind every slide: midnight gradient, topo orbit rings, an animated dashed
travel route with floating waypoints, and a soft gold glow — all built from APEX gradient
tokens and switched off under Reduce Motion.
