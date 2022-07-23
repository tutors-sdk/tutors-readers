import { writable } from "svelte/store";
import type { Lo, WeekType } from "tutors-reader-lib/src/types/lo-types";
import { Course } from "tutors-reader-lib/src/models/course";

const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: new Date(),
};

export const revealSidebar = writable(false);
export const revealInfoBar = writable(false);
export const revealCalendar = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse = writable(new Course(""));
export const currentLo = writable(null);
export const currentUser = writable(null);
export const portfolio = writable(false);
export const layout = writable("");
export const studentsOnline = writable(0);
