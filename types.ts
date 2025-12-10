export type StatusCategory = 'approved' | 'submitted' | 'pending' | 'rejected' | 'draft' | 'not-applicable';

export interface ProjectFeature {
  id: string;
  no: number;
  location: string;
  featureNo: string;
  s3rStatus: string;
  s3rCategory: StatusCategory;
  stlaXpStatus: string;
  stlaCategory: StatusCategory;
  accessPermission: string;
  engineeringPlan: string;
  tprpStatus: string;
  hsspStatus: string;
  remarks?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}