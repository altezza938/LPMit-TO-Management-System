import { ProjectFeature } from './types';

export const MOCK_DATA: ProjectFeature[] = [
  {
    id: '1',
    no: 1,
    location: "West of Tin's Centre Block 9, Hung Cheung Road, Tuen Mun",
    featureNo: "5SE-B/C203",
    s3rStatus: "Final S3R Accepted 5 Aug 2024",
    s3rCategory: "approved",
    stlaXpStatus: "STLA Approved: 16 Jul 2024 - 15 Jul 2025",
    stlaCategory: "approved",
    accessPermission: "Obtained by RSS",
    engineeringPlan: "No comment from MR",
    tprpStatus: "Approved by TWVP 4 Sep 2024",
    hsspStatus: "HSSP endorsed",
    coordinates: { lat: 22.3945, lng: 113.9745 }
  },
  {
    id: '2',
    no: 2,
    location: "West of Tin's Centre Block 9, Hung Cheung Road, Tuen Mun",
    featureNo: "5SE-B/R53",
    s3rStatus: "S3R Accepted by GEO on 1 Aug 2024",
    s3rCategory: "approved",
    stlaXpStatus: "STLA Approved: 16 Jul 2024 - 15 Jul 2025",
    stlaCategory: "approved",
    accessPermission: "Obtained by RSS",
    engineeringPlan: "No comment memo dated 12 Sep 2024",
    tprpStatus: "N/A (no trees)",
    hsspStatus: "N/A",
    coordinates: { lat: 22.3952, lng: 113.9738 }
  },
  {
    id: '3',
    no: 3,
    location: "Sham Tseng East Village Sitting-out Area, Tsuen Wan",
    featureNo: "6SE-C/CR354",
    s3rStatus: "S3R Accepted by GEO on 31 July 2024",
    s3rCategory: "approved",
    stlaXpStatus: "STLA Approved",
    stlaCategory: "approved",
    accessPermission: "N/A",
    engineeringPlan: "No comment from MR",
    tprpStatus: "Approved by TWVP",
    hsspStatus: "N/A",
    coordinates: { lat: 22.3685, lng: 114.0582 }
  },
  {
    id: '4',
    no: 4,
    location: "East of Peak Castle, Siu Lam, Tuen Mun",
    featureNo: "6SW-D/C306",
    s3rStatus: "Revised S3R submitted on 29 Oct 2024",
    s3rCategory: "submitted",
    stlaXpStatus: "To be applied after obtaining consent",
    stlaCategory: "pending",
    accessPermission: "Seeking consent. 1st Reminder 22 Jan 2025",
    engineeringPlan: "No comment from MR",
    tprpStatus: "Pending comment from LandsD",
    hsspStatus: "N/A",
    coordinates: { lat: 22.3628, lng: 114.0125 }
  },
  {
    id: '8',
    no: 8,
    location: "Northwest of Sham Tseng Raw Water Pumping Station",
    featureNo: "6SE-C/CR310",
    s3rStatus: "Final S3R submitted 10 Sep 2025. RTC (pending drawings)",
    s3rCategory: "submitted",
    stlaXpStatus: "N/A (GLA)",
    stlaCategory: "not-applicable",
    accessPermission: "Pending confirmation with WSD",
    engineeringPlan: "Submitted 2 Oct 2025",
    tprpStatus: "N/A",
    hsspStatus: "N/A",
    coordinates: { lat: 22.3695, lng: 114.0550 }
  },
  {
    id: '9',
    no: 9,
    location: "Po Kat Tsai Village, Sha Tau Kok",
    featureNo: "3SW-B/C335",
    s3rStatus: "Final S3R accepted on 10 Oct 2025",
    s3rCategory: "approved",
    stlaXpStatus: "Submitted on 21 Oct 2025",
    stlaCategory: "submitted",
    accessPermission: "Consent obtained (Ms. Wu) 23 Oct 2025",
    engineeringPlan: "Submitted 28 Nov 2025",
    tprpStatus: "Submitted 28 Nov 2025",
    hsspStatus: "Submitted 21 Nov 2025",
    coordinates: { lat: 22.5430, lng: 114.2185 }
  },
  {
    id: '10',
    no: 10,
    location: "South of House No. 40B, Siu Sau Village, Tuen Mun",
    featureNo: "6SW-C/C799",
    s3rStatus: "S3R to be submitted Oct 2025",
    s3rCategory: "pending",
    stlaXpStatus: "ARE - draft memo",
    stlaCategory: "draft",
    accessPermission: "Consent obtained from Mr. Chu",
    engineeringPlan: "To be submitted",
    tprpStatus: "Tree survey Batch 2",
    hsspStatus: "To be submitted",
    coordinates: { lat: 22.3710, lng: 114.0020 }
  },
  {
    id: '11',
    no: 11,
    location: "Northwest of Deauville, Tuen Mun Road",
    featureNo: "6SE-C/C675",
    s3rStatus: "Comments received 10 Sep 2025. Resubmit by 10 Dec 2025",
    s3rCategory: "rejected",
    stlaXpStatus: "XP application to be submitted",
    stlaCategory: "pending",
    accessPermission: "N/A",
    engineeringPlan: "Submitted 26 June 2025",
    tprpStatus: "Comments received 21 Nov 2025",
    hsspStatus: "N/A",
    coordinates: { lat: 22.3755, lng: 114.0050 }
  },
  {
    id: '12',
    no: 12,
    location: "North of Tong Fuk, Lantau Island Catchwater Section F",
    featureNo: "13NE-A/CR177",
    s3rStatus: "Final S3R accepted 12 May 2025",
    s3rCategory: "approved",
    stlaXpStatus: "STLA-TIS 236 (Jun 2025 - May 2026)",
    stlaCategory: "approved",
    accessPermission: "Liaison with AFCD underway",
    engineeringPlan: "Received 10 Nov 2025",
    tprpStatus: "Comments received 26 June 2025",
    hsspStatus: "Approved on 7 Oct 2025",
    coordinates: { lat: 22.2350, lng: 113.9350 }
  },
  {
    id: '18',
    no: 18,
    location: "North of Sham Tseng Village",
    featureNo: "6SE-C/F92",
    s3rStatus: "S3R under preparation",
    s3rCategory: "draft",
    stlaXpStatus: "STLA for GI terminated",
    stlaCategory: "rejected",
    accessPermission: "Verbal consent obtained",
    engineeringPlan: "To be submitted",
    tprpStatus: "Tree survey Batch 2",
    hsspStatus: "To be confirmed with VR",
    coordinates: { lat: 22.3680, lng: 114.0590 }
  },
  {
    id: '22',
    no: 22,
    location: "North of Lido Beach, Tsing Long Highway",
    featureNo: "6SE-C/FR228",
    s3rStatus: "Option report accepted 22 May 2025",
    s3rCategory: "approved",
    stlaXpStatus: "GI commenced Dec 2025",
    stlaCategory: "pending",
    accessPermission: "Pending",
    engineeringPlan: "To be submitted",
    tprpStatus: "To be submitted",
    hsspStatus: "To be submitted",
    coordinates: { lat: 22.3660, lng: 114.0720 }
  }
];

export const COLORS = {
  approved: "#10b981", // emerald-500
  submitted: "#3b82f6", // blue-500
  pending: "#f59e0b", // amber-500
  rejected: "#ef4444", // red-500
  draft: "#a8a29e", // stone-400
  "not-applicable": "#e5e7eb" // gray-200
};