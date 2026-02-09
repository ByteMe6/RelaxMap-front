import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"


interface RatingState {
  averageRatings: Record<string, number>;
}

const initialState: RatingState = {
  averageRatings: {},
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setAverageRating(state, action: PayloadAction<{ id: string; rating: number }>) {
      const { id, rating } = action.payload;
      state.averageRatings[id] = rating;
    },
  },
});

export const { setAverageRating } = ratingSlice.actions;
export default ratingSlice.reducer;
