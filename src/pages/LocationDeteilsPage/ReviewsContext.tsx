import React, { createContext, type ReactNode, useContext, useState } from "react";

interface Review {
  id: number;
  text: string;
  rating: number;
  userResponse: {
    id: number;
    name: string;
    email: string;
  };
  placeResponse: {
    id: number;
    name: string;
    placeType: string;
    region: string;
    imageName: string;
  };
}

interface ReviewData {
  content: Review[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

interface ReviewContextType {
  response: ReviewData | undefined;
  setResponse: React.Dispatch<React.SetStateAction<ReviewData | undefined>>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [response, setResponse] = useState<ReviewData>();

  return (
      <ReviewContext.Provider value={ { response, setResponse } }>
        { children }
      </ReviewContext.Provider>
  );
}

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReviews must be used within ReviewsProvider");

  return context;
}