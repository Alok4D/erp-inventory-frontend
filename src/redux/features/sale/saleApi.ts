import { baseApi } from '../../api/baseApi';

export const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: () => '/sales',
      providesTags: ['Sales'],
    }),
    createSale: builder.mutation({
      query: (data) => ({
        url: '/sales',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sales', 'Products', 'Dashboard'],
    }),
    deleteSale: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sales', 'Products', 'Dashboard'],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation, useDeleteSaleMutation } = saleApi;
