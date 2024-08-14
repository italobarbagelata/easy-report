import { User } from '@/interfaces/user';
import { Action } from 'redux';

interface UserState {
  users: User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: { id: 0, aud: '', role: '', email: ''},
  loading: false,
  error: null,
};

// Define tus propios tipos de acción
interface FetchUsersSuccessAction extends Action {
  type: 'FETCH_USERS_SUCCESS';
  payload: User;
}

interface FetchUsersFailureAction extends Action {
  type: 'FETCH_USERS_FAILURE';
  payload: string;
}

// Usa un tipo de unión para combinar tus tipos de acción
type UserActions = FetchUsersSuccessAction | FetchUsersFailureAction;

function userReducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_USERS_FAILURE':
      return { ...state, error: action.payload, loading: false };
      
    default:
      return state;
  }
}

export default userReducer;