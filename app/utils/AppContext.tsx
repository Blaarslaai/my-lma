"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the context type
interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  defaultOpen: boolean;
  setDefaultOpen: (open: boolean) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [defaultOpen, setDefaultOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("defaultOpen") === "true";
    }
    return false;
  });

  // Sync `defaultOpen` with localStorage
  useEffect(() => {
    localStorage.setItem("defaultOpen", JSON.stringify(defaultOpen));
  }, [defaultOpen]);

  return (
    <AppContext.Provider value={{ user, setUser, defaultOpen, setDefaultOpen }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for context access
export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
