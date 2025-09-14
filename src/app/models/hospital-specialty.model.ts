export interface HospitalSpecialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Hospital {
  id?: string;
  accreditations?: string[];
  address: string;
  amenities?: {
    comfort_during_stay?: string[];
    food?: string[];
    language?: string[];
    money_matters?: string[];
    transportation?: string[];
    treatment_related?: string[];
  };
  centers_of_excellence?: any[]; // Allow for both string[] and object[] formats
  createdAt?: any;
  description: string;
  email?: string;
  emergencyServices?: boolean;
  establishedYear?: number;
  images?: string[];
  name: string;
  phone?: string;
  specialties?: string[];
  totalBeds?: number;
  updatedAt?: any;
  website?: string;
  isActive?: boolean; // Add this for admin filtering
  doctors?: {
    id: string;
    name: string;
    specialty: string;
    image: string;
    experience: string;
    qualification: string;
  }[];
  statistics?: {
    established: string;
    beds: string;
    doctors: string;
    departments: string;
  };
}

export interface HospitalListResponse {
  hospitals: Hospital[];
  total: number;
  page: number;
  pageSize: number;
  specialty?: string;
}
