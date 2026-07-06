import { baseApi } from '../../api/baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    addProduct: builder.mutation({
      query: (data: FormData) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products', 'Dashboard'],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = productApi;
