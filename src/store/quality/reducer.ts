import { QualityComments } from "@/interfaces/inspection";
import { Action } from "redux";

interface QualityState {
  quality_comments: QualityComments[];
  loading: boolean;
  error: string | null;
}

const initialState: QualityState = {
  quality_comments: [],
  loading: false,
  error: null,
};

interface FetchQualityCommentsSuccessAction extends Action {
  type: "FETCH_QUALITY_COMMENTS_SUCCESS";
  payload: QualityComments[];
}

interface FetchQualityCommentsFailureAction extends Action {
  type: "FETCH_QUALITY_COMMENTS_FAILURE";
  payload: string;
}

interface SetQualityCommentsAction extends Action {
  type: "SET_QUALITY_COMMENTS";
  payload: QualityComments;
}

interface DeleteQualityCommentsAction extends Action {
  type: "DELETE_QUALITY_COMMENTS";
  payload: number;
}

type QualityActions =
  | FetchQualityCommentsSuccessAction
  | FetchQualityCommentsFailureAction
  | SetQualityCommentsAction
  | DeleteQualityCommentsAction;

function qualityReducer(
  state = initialState,
  action: QualityActions
): QualityState {
  switch (action.type) {
    case "FETCH_QUALITY_COMMENTS_SUCCESS":
      return { ...state, quality_comments: action.payload, loading: false };
    case "FETCH_QUALITY_COMMENTS_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "SET_QUALITY_COMMENTS":
      return {
        ...state,
        quality_comments: state.quality_comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case "DELETE_QUALITY_COMMENTS":
      const idToDelete = (action as DeleteQualityCommentsAction).payload;
      return {
        ...state,
        quality_comments: state.quality_comments.filter(
          (comment) => comment.id !== idToDelete
        ),
      };
    default:
      return state;
  }
}

export default qualityReducer;
