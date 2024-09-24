import { Inspection, InspectionElement } from "@/interfaces/inspection";
import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";

export const fetchInspections = (userId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from("inspection")
        .select(
          `
        id,
        observations,
        inspection_date,
        status_email,
        place,
        grower,
        final_recomendations,
        extra_details,
        quality_conditions,
        packing_date,
        color:id_color (id, description),
        dispatch:id_dispatch (id, description),
        exporter:id_exporter (id, description),
        label:id_label (id, description),
        package:id_package (id, description),
        phyto_china:id_phyto_china (id, description),
        sizes:id_sizes (id, description),
        weight:id_weight (id, description),
        final_overall:id_final_overall (id, description),
        images:images (id),
        species:id_specie (id, description),
        variety:id_variety (id, description),
        qc_color,
        qc_color_description,
        qc_size,
        qc_size_description,
        qc_brix,
        qc_brix_description,
        qc_flavor,
        qc_flavor_description,
        qc_skin_defects,
        qc_skin_defects_description,
        qc_firmness,
        qc_firmness_description,
        qc_decay,
        qc_decay_description
      `
        )
        .eq("user_id", userId)
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      const mapNestedItem = (item: any): InspectionElement => ({
        id: item?.id,
        description: item?.description,
      });

      const inspections: Inspection[] = data.map((item: any) => ({
        id: item.id,
        observations: item?.observations,
        status_email: item?.status_email,
        inspection_date: item?.inspection_date,
        place: item.place,
        grower: item.grower,
        final_recomendations: item.final_recomendations,
        extra_details: item.extra_details,
        color: mapNestedItem(item.color),
        dispatch: mapNestedItem(item.dispatch),
        exporter: mapNestedItem(item.exporter),
        label: mapNestedItem(item.label),
        package: mapNestedItem(item.package),
        phyto_china: mapNestedItem(item.phyto_china),
        sizes: item.sizes ? mapNestedItem(item.sizes) : undefined,
        weight: mapNestedItem(item.weight),
        final_overall: mapNestedItem(item.final_overall),
        images: item.images.length,
        quality_conditions: item.quality_conditions,
        packing_date: item.packing_date,
        qc_color: item.qc_color,
        qc_color_description: item.qc_color_description,
        qc_size: item.qc_size,
        qc_size_description: item.qc_size_description,
        qc_brix: item.qc_brix,
        qc_brix_description: item.qc_brix_description,
        qc_flavor: item.qc_flavor,
        qc_flavor_description: item.qc_flavor_description,
        qc_skin_defects: item.qc_skin_defects,
        qc_skin_defects_description: item.qc_skin_defects_description,
        qc_firmness: item.qc_firmness,
        qc_firmness_description: item.qc_firmness_description,
        qc_decay: item.qc_decay,
        qc_decay_description: item.qc_decay_description,
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
      const { data, error } = await supabase
        .from("inspection")
        .insert([
          {
            user_id: id,
            status_email: false,
          },
        ])
        .select("id")
        .single();

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
          inspection_date: inspection?.inspection_date,
          id_exporter: inspection?.exporter?.id || inspection?.exporter,
          id_label: inspection?.label?.id || inspection?.label,
          id_phyto_china:
            inspection?.phyto_china?.id || inspection?.phyto_china,
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
          quality_conditions: inspection?.quality_conditions,
          packing_date: inspection?.packing_date,
          id_final_overall:
            inspection?.final_overall?.id || inspection?.final_overall,
          qc_color: inspection?.qc_color,
          qc_color_description: inspection?.qc_color_description,
          qc_size: inspection?.qc_size,
          qc_size_description: inspection?.qc_size_description,
          qc_brix: inspection?.qc_brix,
          qc_brix_description: inspection?.qc_brix_description,
          qc_flavor: inspection?.qc_flavor,
          qc_flavor_description: inspection?.qc_flavor_description,
          qc_skin_defects: inspection?.qc_skin_defects,
          qc_skin_defects_description: inspection?.qc_skin_defects_description,
          qc_firmness: inspection?.qc_firmness,
          qc_firmness_description: inspection?.qc_firmness_description,
          qc_decay: inspection?.qc_decay,
          qc_decay_description: inspection?.qc_decay_description,
          id_specie: inspection?.species?.id || inspection?.species,
          id_variety: inspection?.variety?.id || inspection?.variety,
        })
        .eq("id", id).select(`
        id,
        inspection_date,
        observations,
        status_email,
        place,
        grower,
        final_recomendations,
        quality_conditions,
        packing_date,
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
        ),
        qc_color,
        qc_color_description,
        qc_size,
        qc_size_description,
        qc_brix,
        qc_brix_description,
        qc_flavor,
        qc_flavor_description,
        qc_skin_defects,
        qc_skin_defects_description,
        qc_firmness,
        qc_firmness_description,
        qc_decay,
        qc_decay_description
      `);
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(data);
      dispatch(updateInspectionSuccess(inspection));
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
        inspection_date,
        observations,
        status_email,
        place,
        grower,
        final_recomendations,
        extra_details,
        packing_date,
        quality_conditions,
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
        ),
        qc_color,
        qc_color_description,
        qc_size,
        qc_size_description,
        qc_brix,
        qc_brix_description,
        qc_flavor,
        qc_flavor_description,
        qc_skin_defects,
        qc_skin_defects_description,
        qc_firmness,
        qc_firmness_description,
        qc_decay,
        qc_decay_description
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
