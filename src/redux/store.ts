import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
import locationReducer from "./slice/locationSlice"
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["location"]
}
const rootReducer = combineReducers({
    location: locationReducer
})
export type RootState = ReturnType<typeof rootReducer>
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer
})
export const persistor = persistStore(store)
export default store
export type AppDispatch = typeof store.dispatch