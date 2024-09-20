import { supabase } from "@/supabase/client";
import { Dispatch } from "redux";

interface Inspection {
  id: number;
  observations?: string;
  status_email?: string;
  place: string;
  grower: string;
  final_recomendations: string;
  extra_details: string;
  color: NestedItem;
  dispatch: NestedItem;
  exporter: NestedItem;
  label: NestedItem;
  package: NestedItem;
  phyto_china: NestedItem;
  sizes?: NestedItem;
  weight: NestedItem;
  final_overall: NestedItem;
}

interface NestedItem {
  id: number;
  description: string;
}

export const fetchInspections = (userId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase.from('inspection').select(`
        id,
        observations,
        inspection_date,
        status_email,
        place,
        grower,
        final_recomendations,
        extra_details,
        color:id_color (id, description),
        dispatch:id_dispatch (id, description),
        exporter:id_exporter (id, description),
        label:id_label (id, description),
        package:id_package (id, description),
        phyto_china:id_phyto_china (id, description),
        sizes:id_sizes (id, description),
        weight:id_weight (id, description),
        final_overall:id_final_overall (id, description),
        images:images (id)
      `)
      .eq('user_id', userId)
      .order('id', { ascending: false });

      if (error) {
        throw error;
      }
      
      const mapNestedItem = (item: any): NestedItem => ({
        id: item?.id,
        description: item?.description,
      });

      const inspections: Inspection[] = data.map((item: any) => ({
        id: item.id,
        observations: item?.observations,
        status_email: item?.status_email,
        date: item?.inspection_date,
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
        images: item.images.length
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
          id_final_overall:
            inspection?.final_overall?.id || inspection?.final_overall,
        })
        .eq("id", id).select(`
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
      dispatch(updateInspectionSuccess(data[0]));
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



