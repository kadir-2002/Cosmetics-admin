import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminUserSlice from "./adminUserSlice";
import { userAddressSlice } from "./addressSlice";
import { persistStore, persistReducer ,FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from "redux-persist";
  import createWebStorage from "redux-persist/lib/storage/createWebStorage";

  // Create a storage object that works if localStorage is not available
  const createNoopStorage = () => {
    return {
      getItem(_key: any) {
        return Promise.resolve(null);
      },
      setItem(_key: any, value: number) {
        return Promise.resolve(value);
      },
      removeItem(_key: any) {
        return Promise.resolve();
      },
    };
  };

  
  // Use web storage if available, otherwise use noop storage
  const storage =
    typeof window !== "undefined"
      ? createWebStorage("local")
      : createNoopStorage();
  
  const persistConfig = {
    key: "bullten",
    storage,
  };

const rootReducer = combineReducers({
  user: userSlice,
  addresses: userAddressSlice,
  adminUser: adminUserSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
