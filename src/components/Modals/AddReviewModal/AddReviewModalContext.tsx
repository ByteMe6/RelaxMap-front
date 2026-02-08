import React, { createContext, type ReactNode, useContext, useState } from "react";

interface AddReviewModalContextType {
  isOpen: boolean | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const AddReviewModalContext = createContext<AddReviewModalContextType | undefined>(undefined);

export function AddReviewModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>();

  return (
      <AddReviewModalContext.Provider value={ { isOpen, setIsOpen } }>
        { children }
      </AddReviewModalContext.Provider>
  );
}

export const useAddReviewModal = () => {
  const context = useContext(AddReviewModalContext);
  if (!context) throw new Error("useAddReviewModal must be used within AddReviewModalProvider");

  return context;
};