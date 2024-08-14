import { QualityComments } from "@/interfaces/inspection";
import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";
import { RootState } from "../store";

export const updateQualityCommentsById = (
  qualityComments: QualityComments
) => {
  return async (dispatch: Dispatch) => {
    try {
        const { data, error } = await supabase
          .from("quality")
          .update(
            {
              color: qualityComments.color,
              color_description: qualityComments.color_description,
              size: qualityComments.size,
              size_description: qualityComments.size_description,
              minor: qualityComments.minor,
              minor_description: qualityComments.minor_description,
              firmness: qualityComments.firmness,
              firmness_description: qualityComments.firmness_description,
              others: qualityComments.others,
              others_description: qualityComments.others_description,
            },
          )
          .eq("id", qualityComments.id)
          .select();
        if (error) {
          throw error;
        }
        dispatch(fetchQualityCommentsSuccess(data));
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const insertQualityComments = (id: Number, qualityComments: QualityComments) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase.from("quality").insert([
        {
          color: qualityComments.color,
          color_description: qualityComments.color_description,
          size: qualityComments.size,
          size_description: qualityComments.size_description,
          minor: qualityComments.minor,
          minor_description: qualityComments.minor_description,
          firmness: qualityComments.firmness,
          firmness_description: qualityComments.firmness_description,
          others: qualityComments.others,
          others_description: qualityComments.others_description,
          id_inspection: qualityComments.id_inspection,
          user_id: id,
        },
      ]);
      if (error) {
        throw error;
      }
      console.log(data);
      dispatch(fetchQualityCommentsSuccess(data));
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const fetchQualityCommentsById = (id: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from("quality")
        .select(
          `
        id,
        color,
        color_description,
        size,
        size_description,
        minor,
        minor_description,
        firmness,
        firmness_description,
        others,
        others_description,
        id_inspection
      `
        )
        .eq("id_inspection", id);
      if (error) {
        throw error;
      }
      console.log(data);
      dispatch(fetchQualityCommentsSuccess(data));
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const saveQualityComments = (id: string, qualityComments: QualityComments[]) => {
  console.log(id);
  return async (dispatch: Dispatch) => {
    try {
      for (const comment of qualityComments) {
        // Intenta obtener el comentario de la base de datos
        const { data: existingComment, error } = await supabase
          .from('quality')
          .select('*')
          .eq('id', comment.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (existingComment) {
          const { data, error } = await supabase
          .from("quality")
          .update(
            {
              color: comment.color,
              color_description: comment.color_description,
              size: comment.size,
              size_description: comment.size_description,
              minor: comment.minor,
              minor_description: comment.minor_description,
              firmness: comment.firmness,
              firmness_description: comment.firmness_description,
              others: comment.others,
              others_description: comment.others_description,
            },
          )
          .eq("id", comment.id);
        } else {
          const { data, error } = await supabase.from("quality").insert([
            {
              color: comment.color,
              color_description: comment.color_description,
              size: comment.size,
              size_description: comment.size_description,
              minor: comment.minor,
              minor_description: comment.minor_description,
              firmness: comment.firmness,
              firmness_description: comment.firmness_description,
              others: comment.others,
              others_description: comment.others_description,
              id_inspection: comment.id_inspection,
              user_id: id,
            },
          ]);
        }
      }
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const addNewQualityCommentStore = (qualityComments: QualityComments) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // Obtén el estado actual
      const currentState = getState().quailty.quality_comments;

      console.log(currentState);
      console.log(qualityComments);

      // Agrega el nuevo comentario a la lista
      const updatedState = [...currentState, qualityComments];

      dispatch(fetchQualityCommentsSuccess(updatedState));
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const deleteQualityComment = (id: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from("quality")
        .delete()
        .eq("id", id)
        .select();
      if (error) {
        throw error;
      }
      dispatch(deleteQualityCommentsStore(id));
    } catch (error) {
      dispatch(fetchQualityCommentsFailure(error));
    }
  };
};

export const fetchQualityCommentsSuccess = (
  qualityComments: QualityComments[] | null
) => ({
  type: "FETCH_QUALITY_COMMENTS_SUCCESS",
  payload: qualityComments || [],
});

export const setQualityCommentsStore = (qualityComments: QualityComments) => ({
  type: "SET_QUALITY_COMMENTS",
  payload: qualityComments,
});

export const deleteQualityCommentsStore = (id: number) => ({
  type: "DELETE_QUALITY_COMMENTS",
  payload: id,
});

export const fetchQualityCommentsFailure = (error: any) => ({
  type: "FETCH_QUALITY_COMMENTS_FAILURE",
  payload: error,
});
