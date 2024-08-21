import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js'
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

//combine reducers
const rootReducer = combineReducers({ user: userReducer})

//persisted configuration
const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

//persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store);