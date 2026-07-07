import { baseApi } from '../../api/baseApi';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: (arg: Record<string, any>) => ({
        url: '/roles',
        method: 'GET',
        params: arg,
      }),
      providesTags: ['Roles'],
    }),
    createRole: builder.mutation({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
