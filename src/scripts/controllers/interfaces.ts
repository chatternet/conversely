import { Variant } from "react-bootstrap/esm/types";

export interface AlertTopItem {
  message: string;
  variant: Variant;
  key: string;
}

export type PushAlertTop = (message: string, variant: Variant) => void;

export interface LoginInfo {
  did: string;
  password: string;
}
