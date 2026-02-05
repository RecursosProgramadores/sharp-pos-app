export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  schedule: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration_minutes: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  service_id: string | null;
  barber_id: string | null;
  location_id: string | null;
  reservation_date: string;
  reservation_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  service?: Service;
  barber?: {
    id: string;
    full_name: string;
    photo_url: string | null;
    specialty: string | null;
  };
  location?: Location;
}

export interface ReservationFormData {
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: string;
  barber_id: string;
  location_id: string;
  reservation_date: string;
  reservation_time: string;
}
