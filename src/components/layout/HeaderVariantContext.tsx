"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Variant = "dark" | "light";

const HeaderVariantContext = createContext<{
  variant: Variant;
  setVariant: (v: Variant) => void;
}>({ variant: "dark", setVariant: () => {} });

export function HeaderVariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<Variant>("dark");
  return (
    <HeaderVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </HeaderVariantContext.Provider>
  );
}

export function useHeaderVariant() {
  return useContext(HeaderVariantContext);
}

/**
 * Declared once per page. Light subpages start the header in its light
 * variant (colour logo, navy links, white ground, 1px #E4E7EB bottom line);
 * pages that open on a navy hero leave it dark. Reset to dark on unmount
 * so a route change cannot strand the light variant over a navy hero.
 */
export function SetHeaderVariant({ variant }: { variant: Variant }) {
  const { setVariant } = useHeaderVariant();
  useEffect(() => {
    setVariant(variant);
    return () => setVariant("dark");
  }, [variant, setVariant]);
  return null;
}
