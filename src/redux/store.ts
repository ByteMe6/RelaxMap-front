import { combineReducers, configureStore } from "@reduxjs/toolkit";
import locationSlice from "./slice/locationSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
const persistConfig = {
    key:"root",
    storage,
    whitelist:[]
}
const rootReducer = combineReducers({
    location:locationSlice
})
export type RootState = ReturnType<typeof rootReducer>
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store =  configureStore({
    reducer: persistedReducer
})
export const persistor = persistStore(store)
export default store
export type AppDispatch = typeof store.dispatch