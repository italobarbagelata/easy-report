import inspectionReducer from '@/store/inspection/reducer';
import photoReducer from '@/store/photos/reducer';
import qualityReducer from '@/store/quality/reducer';
import userReducer from '@/store/user/reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  inspection: inspectionReducer,
  user: userReducer,
  quailty: qualityReducer,
  photos: photoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;