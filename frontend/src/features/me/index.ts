// Public barrel — everything outside the feature only imports from here.
export { useMe, usePatchProfile, meQueryKeys } from "./hooks/useMe";
export { MeAggregateSchema } from "./contracts/me.contract";
export type { MeAggregate, CompanyRef } from "./contracts/me.contract";
