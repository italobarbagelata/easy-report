import { User } from "@/interfaces/user";
import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";

export const fetchUsers = () => {
  return async (dispatch: Dispatch) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { id, aud, role, email } = user; 
      dispatch(fetchUsersSuccess({ id, aud, role, email }));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};

export const fetchUsersSuccess = (users: User) => ({
  type: 'FETCH_USERS_SUCCESS',
  payload: users,
});

export const fetchUsersFailure = (message: string) => ({
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


