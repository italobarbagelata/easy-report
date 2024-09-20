import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";
import { Photo } from '@/interfaces/inspection';

//add photo
export const addPhotoSuccess = (photos: Photo[]) => {
  return {
    type: "FETCH_PHOTO_SUCCESS",
    payload: photos,
  };
};

//update photo order
export const updatePhotoOrder = (photo: Photo, newOrder: number) => {
  return {
    type: "UPDATE_PHOTO_ORDER",
    payload: { photo, newOrder },
  };
};

//delete photo
export const deletePhoto = (photoUrl: string) => {
  return {
    type: "DELETE_PHOTO",
    payload: photoUrl,
  };
};

