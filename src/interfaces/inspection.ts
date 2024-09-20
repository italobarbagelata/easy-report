export interface Inspection {
  id?: number;
  date?: Date;
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
  qualityComments?: QualityComments[];
  images?: number;
}

export interface QualityComments {
  id: number;
  color: string;
  color_description: string;
  size: string;
  size_description: string;
  minor: string;
  minor_description: string;
  firmness: string;
  firmness_description: string;
  others: string;
  others_description: string;
  id_inspection: number;
}

export interface InspectionElement {
  id: string;
  description: string;
}

export interface Photo {
  url: string;
  order: number;
}