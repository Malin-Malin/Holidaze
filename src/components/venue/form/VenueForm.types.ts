export type VenueFormState = {
  name: string;
  description: string;
  price: string;
  maxGuests: string;
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
