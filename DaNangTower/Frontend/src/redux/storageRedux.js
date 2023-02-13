import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './userRedux';
import cardSlice from './cardRedux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistedReducer = persistReducer(
    { key: 'root', version: 1, storage },
    combineReducers({ user: userSlice, card: cardSlice }),
);

export const storageRedux = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export let persistor = persistStore(storageRedux);
