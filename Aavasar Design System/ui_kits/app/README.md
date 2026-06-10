# Aavasar — Web App UI Kit

High-fidelity recreation of the authenticated Aavasar product, composed from the design-system
primitives (`Button`, `IconButton`, `Card`, `StatCard`, `Badge`, `Tag`, `ProgressBar`, `Avatar`).

## Run
Open `index.html`. A floating switcher (bottom-center) flips between the two audiences:

- **Student Hub** — left sidebar nav, welcome header, earnings/gigs/applications/rating stats,
  Active Gigs, Recommended for You, and a right rail (Upcoming, course progress, peer network).
- **Recruiter Admin** — top nav + left sidebar, pipeline stats, Active Gigs table with applicant
  volume bars, New Applicants panel, and the "Talent Pulse" report band.

Nav items within each surface are clickable (active state updates).

## Files
- `index.html` — shell + role switcher.
- `StudentDashboard.jsx` — Student Hub (`<StudentDashboard>`, with inline `Sidebar`).
- `RecruiterDashboard.jsx` — Recruiter Admin (`<RecruiterDashboard>`, with inline `TopNav` + `SideNav`).

## Notes
- All currency is NPR with lakh grouping (NPR 1,24,000), per the source.
- Avatars use initials or the source portrait photo; the right-rail/peer images reuse the
  source hero photography.
- Coverage over completeness — these two dashboards exercise the app's core component
  vocabulary (sidebars, stat tiles, status tables, applicant cards, feature bands).
