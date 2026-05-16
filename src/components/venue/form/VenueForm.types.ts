export type VenueFormState = {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  city: string;
  country: string;
} & VenueFormAmenities;

export type VenueFormAmenities = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};
