/**
 * Use cases for the dashboard surface. Each function fans out a
 * single network round-trip — the hook layer composes them in
 * parallel via React Query.
 */
import { dashboardService } from "../api/dashboard.service";

export const getStudentKpis = () => dashboardService.studentKpis();
export const getStudentActiveGigs = () => dashboardService.studentActiveGigs();
export const getStudentUpcoming = () => dashboardService.studentUpcoming();
export const getStudentCourse = () => dashboardService.studentCourse();
export const getRecruiterKpis = () => dashboardService.recruiterKpis();
export const getRecruiterApplicants = () => dashboardService.recruiterApplicants();
