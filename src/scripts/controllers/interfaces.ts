import { Messages } from "chatternet-client-http";

export type { IdNameSuffix } from "chatternet-client-http";

export interface ErrorState {
  title: string;
  message: string;
  display: boolean;
}

export interface LoginInfo {
  did: string;
  password: string;
}

export type Message = Messages.Message;
export type Messages = Map<string, Message>;
