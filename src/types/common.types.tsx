import type { Venue, Booking } from "./venue.types";

export interface Media {
  url: string;
  alt: string;
}

export interface User {
  name: string;
  email: string;
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

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
}
