import React from "react";
import { PlanVisual } from "../components/visuals/PlanVisual";
import { SplitVisual } from "../components/visuals/SplitVisual";
import { SettleVisual } from "../components/visuals/SettleVisual";
import { ItineraryVisual } from "../components/visuals/ItineraryVisual";
import { MemoryVisual } from "../components/visuals/MemoryVisual";

export type SlideVisualProps = { width: number; scale: number; active: boolean };

export type Slide = {
  id: string;
  kicker: string;
  title: string;
  titleAccent?: string; // rendered in gold
  subtitle: string;
  Visual: (props: SlideVisualProps) => React.JSX.Element;
};

/**
 * The onboarding story mirrors the landing page:
 * dream it → split it → settle it → plan it → remember it.
 */
export const SLIDES: Slide[] = [
  {
    id: "plan",
    kicker: "01 · Travel together",
    title: "Your trip. Your people. Your expenses.",
    titleAccent: "Sorted.",
    subtitle:
      "TripSplit brings trip planning, shared expenses, settlements and memories together — less math, more journey.",
    Visual: PlanVisual,
  },
  {
    id: "split",
    kicker: "02 · Split smarter",
    title: "Stop calculating.",
    titleAccent: "Start enjoying.",
    subtitle:
      "Add an expense, pick who paid, choose the crew. Equal or custom — TripSplit handles the math to the exact rupee.",
    Visual: SplitVisual,
  },
  {
    id: "settle",
    kicker: "03 · Settle up",
    title: "Everyone knows",
    titleAccent: "exactly what they owe.",
    subtitle:
      "At trip's end, balances are simplified into the fewest possible payments. No awkward last-night calculator.",
    Visual: SettleVisual,
  },
  {
    id: "itinerary",
    kicker: "04 · Plan the journey",
    title: "The whole trip,",
    titleAccent: "one timeline.",
    subtitle:
      "Destinations, stops, trains, hotels and budgets — organized day by day, shared with your whole crew.",
    Visual: ItineraryVisual,
  },
  {
    id: "memory",
    kicker: "05 · Remember it",
    title: "Don't just finish the trip.",
    titleAccent: "Relive it.",
    subtitle:
      "Stats, stories, achievements and a year in review — your trips become memories you can scroll through.",
    Visual: MemoryVisual,
  },
];
