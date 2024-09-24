import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";
import { Photo } from '@/interfaces/inspection';

export const savePhotoOrder = (inspection_id: number, photos: Photo[]) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("Saving photo order for inspection_id:", inspection_id);
      console.log("Photos to update:", photos);

      // Update photos one by one
      for (const photo of photos) {
        const filename = photo.url.split('/').pop() || '';
        const { data, error } = await supabase
          .from("images")
          .update({ order: photo.order })
          .eq('name', filename) 
          .eq('inspection_id', inspection_id);

        if (error) {
          console.error(`Error updating photo `, error);
          dispatch({ type: "SAVE_PHOTO_ORDER_ERROR", payload: error.message });
          return;
        }
      }

      console.log("Photo order saved successfully.");
      dispatch({
        type: "UPDATE_PHOTOS",
        payload: photos,
      });

    } catch (error) {
      console.error("Unexpected error saving photo order:", error);
      dispatch({ type: "SAVE_PHOTO_ORDER_ERROR", payload: "Unexpected error occurred" });
    }
  };
};

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

