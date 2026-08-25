"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Variant = "dark" | "light";

const HeaderVariantContext = createContext<{
  variant: Variant;
  setVariant: (v: Variant) => void;
} | null>(null);

/** Wraps the app; Header reads the current variant, pages set it. */
export function HeaderVariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<Variant>("dark");
  return (
    <HeaderVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </HeaderVariantContext.Provider>
  );
}

export function useHeaderVariant() {
  const ctx = useContext(HeaderVariantContext);
  if (!ctx) throw new Error("useHeaderVariant must be used within HeaderVariantProvider");
  return ctx;
}

/**
 * Drop this at the top of any page whose Hero is NOT the dark navy Hero —
 * design.md §4.1: "na světlých podstránkách header startuje ve light
 * variantě". Resets back to dark on unmount so navigating back to a dark
 * page (e.g. the homepage) doesn't leave the header stuck light.
 */
export function SetHeaderVariant({ variant }: { variant: Variant }) {
  const { setVariant } = useHeaderVariant();
  useEffect(() => {
    setVariant(variant);
    return () => setVariant("dark");
  }, [variant, setVariant]);
  return null;
}
