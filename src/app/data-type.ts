export interface signUp {
  name: string;
  email: string;
  password: string;
}
export interface book {
  patientName: string;
  email: string;
  phone: string;
  city?: string;
  concern: string;
}

export interface login {
  email: String;
  password: String;
}

export interface product {
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
  id: number;
  quantity: undefined | number;
  productId: undefined | number;
}
export interface cart {
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
  id: number | undefined;
  quantity: undefined | number;
  productId: number;
  userId: number;
}

export interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

export interface order {
  email: string;
  address: string;
  contact: string;
  totalPrice: number;
  userId: string;
  id: number | undefined;
}

export interface hospital {
  id: number;
  title: string;
  city: string;
  country: string;
  image: string;
  description: string;
  specialities: any[];
  rating: number;
  establishedYear: number;
  emergencyServices: boolean;
  bedCount: number;
  accreditation: string[];
  website?: string;
  phone?: string;
  address: string;
}

export interface doctor {
  id: number;
  name: string;
  specialities: any[];
  image: string;
  location: string;
  experience: string;
  designation: string;
  hospital: string;
  qualifications: string[];
  description: string;
  rating: number;
  consultationFee?: number;
  languages: string[];
  availability: string;
  phone?: string;
  email?: string;
}

export interface testimonial {
  id: number;
  name: string;
  specialty: string;
  image: string;
  review: string;
  rating?: number;
}
