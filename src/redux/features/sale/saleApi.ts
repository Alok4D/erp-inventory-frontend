import { baseApi } from '../../api/baseApi';

export const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: (params) => {
        let url = '/sales';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          
          const queryString = queryParams.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
        }
        return url;
      },
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
