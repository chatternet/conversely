import { Dispatch, SetStateAction } from "react";

export { default as LOGO } from "../assets/logo.svg";
export { default as LOGO_SOLID } from "../assets/logo-solid.svg";

export type SetState<T> = Dispatch<SetStateAction<T>>;
export type UseState<T> = [T, SetState<T>];

export const ROOT_PATH = "";
export const MAX_POST_BYTES = 1024;

export function navigate(url: string | URL) {
  history.pushState(null, "", url);
  dispatchEvent(new PopStateEvent("popstate"));
}

export function clearState() {
  window.location.assign(`${ROOT_PATH}/`);
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
