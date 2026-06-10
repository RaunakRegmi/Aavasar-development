import { useQuery } from "@tanstack/react-query";
import {
  getRecruiterApplicants,
  getRecruiterKpis,
  getStudentActiveGigs,
  getStudentCourse,
  getStudentKpis,
  getStudentUpcoming,
} from "../application/getDashboard.usecase";

export const dashboardKeys = {
  studentKpis: ["dashboard", "student", "kpis"] as const,
  studentActiveGigs: ["dashboard", "student", "active-gigs"] as const,
  studentUpcoming: ["dashboard", "student", "upcoming"] as const,
  studentCourse: ["dashboard", "student", "course"] as const,
  recruiterKpis: ["dashboard", "recruiter", "kpis"] as const,
  recruiterApplicants: ["dashboard", "recruiter", "applicants"] as const,
};

export function useStudentDashboard() {
  return {
    kpis: useQuery({ queryKey: dashboardKeys.studentKpis, queryFn: getStudentKpis }),
    activeGigs: useQuery({
      queryKey: dashboardKeys.studentActiveGigs,
      queryFn: getStudentActiveGigs,
    }),
    upcoming: useQuery({
      queryKey: dashboardKeys.studentUpcoming,
      queryFn: getStudentUpcoming,
    }),
    course: useQuery({
      queryKey: dashboardKeys.studentCourse,
      queryFn: getStudentCourse,
    }),
  };
}

export function useRecruiterDashboard() {
  return {
    kpis: useQuery({ queryKey: dashboardKeys.recruiterKpis, queryFn: getRecruiterKpis }),
    applicants: useQuery({
      queryKey: dashboardKeys.recruiterApplicants,
      queryFn: getRecruiterApplicants,
    }),
  };
}
