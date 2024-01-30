import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cls(...args) {
  return twMerge(clsx(args));
}

// The input date to this function should always be in the
// rfc3339 format.
export function rfc3339ToDate(date) {
  return moment(date).format("MMMM Do YYYY");
}
