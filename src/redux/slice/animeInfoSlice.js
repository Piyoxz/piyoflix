import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAnimeInfo = createAsyncThunk("fetchAnimeInfo", async (id) => {
  const response =
    (await axios.get(
      `/api/anime/${id}`,
    )) ||
    (await axios.get(`/api/anime/${id}`));
  return response;
});

const animeInfoSlice = createSlice({
  name: "animeInfo",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAnimeInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAnimeInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchAnimeInfo.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export default animeInfoSlice.reducer;
