import { User } from "@/interfaces/user";
import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";

export const fetchUsers = () => {
  return async (dispatch: Dispatch) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { id, aud, role, email } = user;
        dispatch(fetchUsersSuccess({ id, aud, role, email }));
      } else {
        throw new Error("User is null");
      }
    } catch (error) {
      dispatch(fetchUsersFailure(error));
    }
  };
};

export const fetchUsersSuccess = (users: User) => ({
  type: 'FETCH_USERS_SUCCESS',
  payload: users,
});

export const fetchUsersFailure = (message: any) => ({
  type: 'FETCH_USERS_FAILURE',
  payload: message,
});

export const fetchUsersLoading = () => ({
  type: 'FETCH_USERS_LOADING',
});

export const fetchUsersLoaded = () => ({
  type: 'FETCH_USERS_LOADED',
});

export const fetchUsersReset = () => ({
  type: 'FETCH_USERS_RESET',
});


