import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import locationReducer from "./slice/locationSlice";
import authReducer from "./slice/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["location", "auth"], // что сохраняем
};

const rootReducer = combineReducers({
  location: locationReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ОБЯЗАТЕЛЬНО для redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
export type AppDispatch = typeof store.dispatch;