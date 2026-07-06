import { baseApi } from '../../api/baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (arg?: { searchTerm?: string; page?: number; limit?: number }) => {
        return {
          url: '/products',
          method: 'GET',
          params: arg,
        };
      },
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
    updateProduct: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products', 'Dashboard'],
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'Dashboard'],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation 
} = productApi;
