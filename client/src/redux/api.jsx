import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (data) => ({
        url: "users/signin",
        method: "POST",
        body: data,
      }),
    }),

    signup: builder.mutation({
      query: (data) => ({
        url: "users/signup",
        method: "POST",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "users/get-users",
      }),
    }),

    createRoom: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}`,
        method: "POST",
        body: {
          name: data.roomName,
          host: data.userId,
        },
      }),
      invalidatesTags: ["Room"],
    }),

    deleteRoom: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/delete-room`,
        method: "POST",
      }),
      invalidatesTags: ["Room"],
    }),

    editRoom: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/edit-room`,
        method: "POST",
        body: { isProtected: data.isProtected },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.id }],
    }),

    getRooms: builder.query({
      query: ({ userId }) => ({
        url: `rooms/${userId}`,
      }),
      providesTags: ["Room"],
    }),

    getRoom: builder.query({
      query: ({ userId, roomId }) => ({
        url: `rooms/${userId}/${roomId}`,
      }),
      providedTags: (result, error, id) => [{ type: "Room", id }],
    }),

    addUserInRoom: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/add-user`,
        method: "PATCH",
        body: { newUserId: data.newUserId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.id }],
    }),

    removeUserFromRoom: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/remove-user`,
        method: "PATCH",
        body: { newUserId: data.newUserId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.id }],
    }),

    postMessage: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/message`,
        method: "POST",
        body: { message: data.message },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.id }],
    }),

    uploadFile: builder.mutation({
      query: (data) => ({
        url: `rooms/${data.userId}/${data.roomId}/upload`,
        method: 'POST',
        body: data.file,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.roomId }],
    }),

    deleteMessage: builder.mutation({
      query: ({ userId, roomId, messageId }) => ({
        url: `rooms/${userId}/${roomId}/message/${messageId}`,
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Room", id: arg.roomId }],
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetUsersQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useEditRoomMutation,
  useGetRoomQuery,
  useGetRoomsQuery,
  useAddUserInRoomMutation,
  useRemoveUserFromRoomMutation,
  usePostMessageMutation,
  useUploadFileMutation,
  useDeleteMessageMutation,
} = api;
