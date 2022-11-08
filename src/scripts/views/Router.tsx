import { ROOT_PATH } from "../commonutils";
import { Feed, FeedProps } from "./Feed";
import { Settings, SettingsProps } from "./Settings";
import { Welcome, WelcomeProps } from "./Welcome";

export type RouterProps = {
  location: URL;
  loggedIn: boolean;
  feedProps: FeedProps;
  welcomeProps: WelcomeProps;
  settingsProps: SettingsProps;
};

export function Router(props: RouterProps) {
  if (props.location.pathname === `${ROOT_PATH}/` && !props.location.search) {
    return <Welcome {...props.welcomeProps} />;
  } else if (
    props.location.pathname === `${ROOT_PATH}/` &&
    props.location.search === "?feed"
  ) {
    return <Feed {...props.feedProps} />;
  } else if (
    props.location.pathname === `${ROOT_PATH}/` &&
    props.location.search === "?settings"
  ) {
    return <Settings {...props.settingsProps} />;
  }
  return null;
}
