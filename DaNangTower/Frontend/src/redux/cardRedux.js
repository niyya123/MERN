import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userRequest } from '../utils/request';
import { toast } from 'react-toastify';

const cardSlice = createSlice({
    name: 'card',
    initialState: {
        message: '',
        currentCards: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCard.pending, (state, action) => {
            state.message = '';
            state.loading = true;
        });
        builder.addCase(getAllCard.fulfilled, (state, action) => {
            state.message = '';
            state.currentCards = action.payload.card;
            state.loading = false;
        });

        builder.addCase(updateCard.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.currentCards = action.payload.card;
        });

        builder.addCase(createCard.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.currentCards = action.payload.card;
        });

        builder.addCase(deleteCard.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.currentCards = action.payload.card;
        });

        builder.addCase(deleteManyCards.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.currentCards = action.payload.card;
        });
    },
});
export const getAllCard = createAsyncThunk('card/getAll', async () => {
    const result = await userRequest().get('/admin/card');
    return result.data;
});
export const updateCard = createAsyncThunk('card/updateCard', async (param, { rejectWithValue }) => {
    try {
        const result = await userRequest().post('/admin/card/addEvent', {
            idCard: param.idCard,
            idEvent: param.idEvent,
        });
        toast.success(result.data.message, {
            position: 'top-right',
            theme: 'colored',
        });
        return result.data;
    } catch (error) {
        toast.error(error.response.data.message, {
            position: 'top-right',
            theme: 'colored',
        });
        return rejectWithValue(error);
    }
});

export const createCard = createAsyncThunk('card/createCard', async (param, { rejectWithValue }) => {
    try {
        const result = await userRequest().post('/admin/card/createCard', {
            idUser: param.idUser,
            idEvent: param.idEvent,
        });
        toast.success(result.data.message, {
            position: 'top-right',
            theme: 'colored',
        });
        return result.data;
    } catch (error) {
        toast.error(error.response.data.message, {
            position: 'top-right',
            theme: 'colored',
        });
        return rejectWithValue(error);
    }
});
export const deleteCard = createAsyncThunk('card/delete', async (param) => {
    const result = await userRequest().post('/admin/card/deleteCard', {
        idCard: param,
    });
    toast.success(result.data.message, {
        position: 'top-right',
        theme: 'colored',
    });
    return result.data;
});

export const deleteManyCards = createAsyncThunk('card/deleteMany', async (param, { rejectWithValue }) => {
    try {
        const result = await userRequest().post('/admin/card/deleteManyCards', {
            ids: param,
        });
        toast.success('Xóa vé thành công', {
            position: 'top-right',
            theme: 'colored',
        });
        return result.data;
    } catch (error) {
        toast.error(error.response.data.message, {
            position: 'top-right',
            theme: 'colored',
        });
        return rejectWithValue(error);
    }
});

export default cardSlice.reducer;
