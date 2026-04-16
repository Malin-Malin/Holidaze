import type { Venue, Booking } from "./venue.types";
import type { Media } from "./common.types";

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  venueManager: boolean;
  venues: Venue[];
  bookings: Booking[];
  _count: {
    venues: number;
    bookings: number;
  };
}

export type ProfileData = {
  avatar: Media;
  banner: Media;
  bio: string;
  venueManager: boolean;
};
