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
      const inspections = data.map((item: any) => ({
        id: item.id,
        observations: item.observations,
        status_email: item.status_email,
        place: item.place,
        grower: item.grower,
        final_recomendations: item.final_recomendations,
        extra_details: item.extra_details,
        color: item.color.map((color: any) => ({
          id: color.id,
          description: color.description,
        })),
        dispatch: item.dispatch.map((dispatch: any) => ({
          id: dispatch.id,
          description: dispatch.description,
        })),
        exporter: item.exporter.map((exporter: any) => ({
          id: exporter.id,
          description: exporter.description,
        })),
        label: item.label.map((label: any) => ({
          id: label.id,
          description: label.description,
        })),
        package: item.package.map((package_kingo: any) => ({
          id: package_kingo.id,
          description: package_kingo.description,
        })),
        phyto_china: item.phyto_china.map((phyto_china: any) => ({
          id: phyto_china.id,
          description: phyto_china.description,
        })),
        sizes: item.sizes.map((sizes: any) => ({
          id: sizes.id,
          description: sizes.description,
        })),
        weight: item.weight.map((weight: any) => ({
          id: weight.id,
          description: weight.description,
        })),
        final_overall: item.final_overall.map((final_overall: any) => ({
          id: final_overall.id,
          description: final_overall.description,
        })),
      }));
      dispatch(fetchInspectionsSuccess(inspections));
    } catch (error) {
      dispatch(fetchInspectionsFailure(error));
    }
  };
};

export const createInspection = (id: string) => {
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
      dispatch(fetchInspectionsFailure(error));
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
      dispatch(updateInspectionSuccess(data as Inspection));
    } catch (error) {
      dispatch(fetchInspectionsFailure(error));
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
      dispatch(fetchInspectionsFailure(error));
    }
  };
};

export const fetchInspectionSuccess = (inspection: any) => {
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

export const fetchInspectionsFailure = (error: any) => {
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
