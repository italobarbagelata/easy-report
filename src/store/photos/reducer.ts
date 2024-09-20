import { Photo } from "@/interfaces/inspection";
import { Action } from "redux";

interface PhotoState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  loading: false,
  error: null,
};

interface FetchPhotoSuccessAction extends Action {
  type: "FETCH_PHOTO_SUCCESS";
  payload: Photo[];
}

interface FetchPhotoFailureAction extends Action {
  type: "FETCH_PHOTO_FAILURE";
  payload: string;
}

interface FetchPhotoSuccessAction extends Action {
  type: "FETCH_PHOTO_SUCCESS";
  payload: Photo[];
}

interface UpdatePhotoOrderAction extends Action {
  type: "UPDATE_PHOTO_ORDER";
  payload: { photo: Photo; newOrder: number };
}

interface DeletePhotoAction extends Action {
  type: "DELETE_PHOTO";
  payload: string;
}

type PhotoActions =
  | FetchPhotoSuccessAction
  | FetchPhotoFailureAction
  | FetchPhotoSuccessAction
  | UpdatePhotoOrderAction
  | DeletePhotoAction;

function photoReducer(state = initialState, action: PhotoActions): PhotoState {
  switch (action.type) {
    case "FETCH_PHOTO_SUCCESS":
      return { ...state, photos: action.payload, loading: false };
    case "FETCH_PHOTO_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "FETCH_PHOTO_SUCCESS":
      return { ...state, photos: action.payload, loading: false };
    case "UPDATE_PHOTO_ORDER":
      const { photo, newOrder } = action.payload;
      const updatedPhotos = state.photos.map(
        (p) => (p.url === photo.url ? { ...p, order: newOrder } : p) // Actualizar solo el campo order
      );
      return { ...state, photos: updatedPhotos, loading: false };
    case "DELETE_PHOTO":
      const deletedPhotos = state.photos.filter(
        (p) => p.url !== action.payload
      );
      return { ...state, photos: deletedPhotos, loading: false };
    default:
      return state;
  }
}

export default photoReducer;
