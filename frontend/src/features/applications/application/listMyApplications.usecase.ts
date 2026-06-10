import { applicationService } from "../api/application.service";
import type { GigApplication } from "../contracts/application.contract";

export async function listMyApplications(): Promise<GigApplication[]> {
  const { items } = await applicationService.listMy();
  return items;
}
