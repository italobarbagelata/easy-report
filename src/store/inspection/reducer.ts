import { Inspection } from '@/interfaces/inspection';
import { Action } from 'redux';

interface InspectionsState {
  inspections: Inspection[];
  inspection: Inspection | null;
  loading: boolean;
  error: string | null;
}

const initialState: InspectionsState = {
  inspections: [],
  inspection: null,
  loading: false,
  error: null,
};


interface FetchInspectionsSuccessAction extends Action {
  type: 'FETCH_INSPECTIONS_SUCCESS';
  payload: Inspection[];
}

interface FetchInspectionsFailureAction extends Action {
  type: 'FETCH_INSPECTIONS_FAILURE';
  payload: string;
}

interface FetchInspectionSuccessAction extends Action {
  type: 'FETCH_INSPECTION_SUCCESS';
  payload: Inspection;
}

interface UpdateInspectionSuccessAction extends Action {
  type: 'UPDATE_INSPECTION_SUCCESS';
  payload: Inspection;
}

type InspectionActions = FetchInspectionsSuccessAction | FetchInspectionsFailureAction | FetchInspectionSuccessAction | UpdateInspectionSuccessAction;

function inspectionReducer(state = initialState, action: InspectionActions): InspectionsState {
  switch (action.type) {
    case 'FETCH_INSPECTIONS_SUCCESS':
      return { ...state, inspections: action.payload, loading: false };
    case 'FETCH_INSPECTIONS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'FETCH_INSPECTION_SUCCESS':
      return { ...state, inspection: action.payload, loading: false };
    case 'UPDATE_INSPECTION_SUCCESS':
      return { ...state, inspection: action.payload, loading: false };
      
    default:
      return state;
  }
}

export default inspectionReducer;