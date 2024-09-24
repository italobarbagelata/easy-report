export interface Inspection {
  id?: number;
  inspection_date?: string;
  exporter?: InspectionElement;
  label?: InspectionElement;
  place?: string;
  phyto_china?: InspectionElement;
  dispatch?: InspectionElement;
  package?: InspectionElement;
  weight?: InspectionElement;
  species?: InspectionElement;
  sizes?: InspectionElement;
  variety?: InspectionElement;
  color?: InspectionElement;
  final_overall?: InspectionElement;
  grower?: string;
  observations?: string;
  final_recomendations?: string;
  user_id?: number;
  status_email?: boolean;
  extra_details?: string;
  images?: number;
  quality_conditions?: string;
  qc_color?: string;
  qc_color_description?: string;
  qc_size?: string;
  qc_size_description?: string;
  qc_brix?: string;
  qc_brix_description?: string;
  qc_flavor?: string;
  qc_flavor_description?: string;
  qc_skin_defects?: string;
  qc_skin_defects_description?: string;
  qc_firmness?: string;
  qc_firmness_description?: string;
  qc_decay?: string;
  qc_decay_description?: string;
  packing_date?: string;
}

export interface QualityComments {
  id: number;
  id_inspection: number;
  color?: string;
  color_description?: string;
  size?: string;
  size_description?: string;
  minor?: string;
  minor_description?: string;
  firmness?: string;
  firmness_description?: string;
  others?: string;
  others_description?: string;
  brix?: string;
  brix_description?: string;
  flavor?: string;
  flavor_description?: string;
  skin_defect?: string;
  skin_defect_description?: string;
  decay?: string;
  decay_description?: string;
}

export interface InspectionElement {
  id: string;
  description: string;
}

export interface Photo {
  url: string;
  order: number;
}