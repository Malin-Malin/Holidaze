import type { Media } from "./common.types";
import type { Profile } from "./profile.types";

export interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export interface VenueLocation {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  owner: Profile;
  _count: {
    bookings: number;
  };
}

export type VenueData = Omit<
  Venue,
  "id" | "created" | "updated" | "owner" | "_count"
>;

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: Venue;
  customer: Profile;
}

export type BookingCreateData = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type BookingUpdateData = Omit<BookingCreateData, "venueId">;
