'use client'
import React, { createContext, useContext, useState } from 'react';

interface PracticeType {
  practiceId: number | null;
  setPracticeId: (id: number | null) => void;
}

const usePractice = () => {
  const [practiceId, setPracticeId] = useState<number | null>(null);
  return { practiceId, setPracticeId };
};

const PracticeContext = createContext<PracticeType | undefined>(undefined);

export const PracticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const usePracticeValue = usePractice();

  return (
    <PracticeContext.Provider value={usePracticeValue}>
      {children}
    </PracticeContext.Provider>
  );
};

export const usePracticeContext = () => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePracticeContext must be used within a PracticeProvider');
  }
  return context;
};
