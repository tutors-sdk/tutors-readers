// @ts-ignore
import path from "path-browserify";
import { courseUrl, currentCourse, currentUser, week } from "../../stores";
import { replace } from "svelte-spa-router";
import { Course } from "tutors-reader-lib/src/models/course";
import type { Topic } from "tutors-reader-lib/src/models/topic";
import { Lab } from "tutors-reader-lib/src/models/lab";
import { lastSegment } from "tutors-reader-lib/src/utils/lo-utils";
import { fromLocalStorage, getUserId, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
import { fetchUserById } from "tutors-reader-lib/src/utils/metrics-utils";
import type { WeekType } from "tutors-reader-lib/src/types/lo-types";

export class CourseService {
  course?: Course;
  courses = new Map<string, Course>();
  courseUrl = "";
  loadError = false;

  constructor() {}

  async getCourse(url: string): Promise<void> {
    if (!this.course || this.course.url !== url) {
      this.courseUrl = url;
      this.course = this.courses.get(url);
      if (!this.course) {
        this.course = new Course(url);
        try {
          await this.course.fetchCourse();
        } catch (e) {
          this.courseUrl = "";
          this.course = undefined;
          this.loadError = true;
          console.log(e);
        }
      }
    }
  }

  async fetchCourse(url: string): Promise<Course> {
    await this.getCourse(url);
    if (!this.loadError) {
      if (this.course?.hasWhiteList()) {
        if (isAuthenticated()) {
          const user = fromLocalStorage();
          const student = this.course.getStudents().find((student) => student.github === user.nickname);
          if (!student) {
            console.log("Not Authorised to access this models");
            replace(`/unauthorised`);
          }
        }
      }
      currentCourse.set(this.course!);
      if (isAuthenticated()) {
        const user = await fetchUserById(this?.course?.url, getUserId(), null);

        // @ts-ignore
        currentUser.set(user);
      }
      week.set(<WeekType>this?.course?.currentWeek);
      courseUrl.set(url);
    }
    return this.course;
  }

  async fetchTopic(url: string): Promise<Topic | undefined> {
    await this.fetchCourse(path.dirname(url));
    return this.course?.topicIndex.get(lastSegment(url));
  }

  async fetchCourseFromTalk(url: string) {
    url = url.substring(0, url.indexOf("/"));
    await this.fetchCourse(url);
    return this.course;
  }

  async fetchWall(url: string) {
    const path = url.split("/");
    await this.fetchCourse(path[1]);
    return this.course?.walls.get(path[0]);
  }

  async fetchLab(url: string): Promise<Lab> {
    let courseUrl = url.substring(0, url.indexOf("/"));
    await this.fetchCourse(courseUrl);
    let labId = `/#/lab/${url}`;
    const lastSegment = url.substr(url.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      url = url.substr(0, url.lastIndexOf("/"));
      labId = `/#/lab/${url}`;
    }
    const lo = this.course?.labIndex.get(labId);
    let lab = this.course?.hydratedLabs.get(labId);
    if (!lab && this.course) {
      lab = new Lab(this.course, lo!, url);
      this.course?.hydratedLabs.set(labId, lab);
    }
    return lab;
  }
}
