"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoanModel } from "./loanModel";

// Define the context type
interface AppContextType {
  currentLoan: LoanModel | null;
  setCurrentLoan: (loan: LoanModel) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [currentLoan, setCurrentLoan] = useState<LoanModel | null>(null);

  return (
    <AppContext.Provider value={{ currentLoan, setCurrentLoan }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for context access
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
