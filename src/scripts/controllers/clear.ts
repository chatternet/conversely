import { clearState } from "../commonutils";
import { ChatterNet } from "chatternet-client-http";

export async function clearAll() {
  sessionStorage.clear();
  localStorage.clear();
  ChatterNet.clearDbs().catch((x) => console.error(x));
  clearState();
}
