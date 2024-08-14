import { Inspection } from "@/interfaces/inspection";
import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";

export const fetchInspections = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase.from("inspection").select(`
        id,
        observations,
        status_email,
        place,
        grower,
        final_recomendations,
        extra_details,
        color:id_color (
          description
        ),
        dispatch:id_dispatch (
          description
        ),
        exporter:id_exporter (
          description
        ),
        label:id_label (
          description
        ),
        package:id_package (
          description
        ),
        phyto_china:id_phyto_china (
          description
        ),
        sizes:id_sizes (
          description
        ),
        weight:id_weight (
          description
        ),
        final_overall:id_final_overall (
          description
        )
      `);
      if (error) {
        throw error;
      }
      dispatch(fetchInspectionsSuccess(data));
    } catch (error) {
      dispatch(fetchInspectionsFailure(error.message));
    }
  };
};

export const createInspection = (id: Number) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase.from("inspection").insert([
        {
          user_id: id,
          status_email: false,
        },
      ]).select("id").single();

      if (error) {
        throw error;
      }
      return data.id;
    } catch (error) {
      dispatch(fetchInspectionsFailure(error.message));
      throw error;
    }
  };
};

export const updateInspection = (id: Number, inspection: Inspection) => {
  console.log(inspection);
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from("inspection")
        .update({
          id_exporter: inspection?.exporter?.id || inspection?.exporter,
          id_label: inspection?.label?.id || inspection?.label,
          id_phyto_china: inspection?.phyto_china?.id || inspection?.phyto_china,
          id_dispatch: inspection?.dispatch?.id || inspection?.dispatch,
          id_package: inspection?.package?.id || inspection?.package,
          id_weight: inspection?.weight?.id || inspection?.weight,
          id_sizes: inspection?.sizes?.id || inspection?.sizes,
          id_color: inspection?.color?.id || inspection?.color,
          observations: inspection?.observations,
          status_email: inspection?.status_email,
          place: inspection?.place,
          grower: inspection?.grower,
          final_recomendations: inspection?.final_recomendations,
          extra_details: inspection?.extra_details,
          id_final_overall: inspection?.final_overall?.id || inspection?.final_overall,
        })
        .eq("id", id)
        .select(`
        id,
        observations,
        status_email,
        place,
        grower,
        final_recomendations,
        color:id_color (
          id,
          description
        ),
        dispatch:id_dispatch (
          id,
          description
        ),
        exporter:id_exporter (
          id,
          description
        ),
        label:id_label (
          id,
          description
        ),
        package:id_package (
          id,
          description
        ),
        phyto_china:id_phyto_china (
          id,
          description
        ),
        sizes:id_sizes (
          id,
          description
        ),
        weight:id_weight (
          id,
          description
        ),
        final_overall:id_final_overall (
          id,
          description
        )
      `);
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(data);
      dispatch(updateInspectionSuccess(data));
    } catch (error) {
      dispatch(fetchInspectionsFailure(error.message));
    }
  };
};

export const fetchInspection = (id: Number) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from("inspection")
        .select(
          `
        id,
        observations,
        status_email,
        place,
        grower,
        final_recomendations,
        extra_details,
        color:id_color (
          id,
          description
        ),
        dispatch:id_dispatch (
          id,
          description
        ),
        exporter:id_exporter (
          id,
          description
        ),
        label:id_label (
          id,
          description
        ),
        package:id_package (
          id,
          description
        ),
        phyto_china:id_phyto_china (
          id,
          description
        ),
        sizes:id_sizes (
          id,
          description
        ),
        weight:id_weight (
          id,
          description
        ),
        final_overall:id_final_overall (
          id,
          description
        ),
        species:id_specie (
          id,
          description
        ),
        variety:id_variety (
          id,
          description
        )
      `
        )
        .eq("id", id);
      if (error) {
        throw error;
      }
      console.log(data);
      dispatch(fetchInspectionSuccess(data[0]));
    } catch (error) {
      dispatch(fetchInspectionsFailure(error.message));
    }
  };
};

export const fetchInspectionSuccess = (inspection: Inspection) => {
  return {
    type: "FETCH_INSPECTION_SUCCESS",
    payload: inspection,
  };
};

export const fetchInspectionsSuccess = (inspections: Inspection[]) => {
  return {
    type: "FETCH_INSPECTIONS_SUCCESS",
    payload: inspections,
  };
};

export const fetchInspectionsFailure = (error) => {
  return {
    type: "FETCH_INSPECTIONS_FAILURE",
    payload: error,
  };
};

export const updateInspectionSuccess = (inspection: Inspection) => {
  return {
    type: "UPDATE_INSPECTION_SUCCESS",
    payload: inspection,
  };
};
