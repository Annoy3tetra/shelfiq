import api from "../api/axios";

export const getBooks = async (
  page = 1,
  limit = 10
) => {
  const response = await api.get(
    `/books?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const createBook = async (
  bookData
) => {
  const response = await api.post(
    "/books",
    bookData
  );

  return response.data;
};

export const updateBook = async (
  id,
  bookData
) => {
  const response = await api.put(
    `/books/${id}`,
    bookData
  );

  return response.data;
};

export const deleteBook = async (
  id
) => {
  const response = await api.delete(
    `/books/${id}`
  );

  return response.data;
};
