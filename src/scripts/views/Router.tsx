import { ROOT_PATH } from "../commonutils";
import { Feed, FeedProps } from "./Feed";
import { Following, FollowingProps } from "./Following";
import { Settings, SettingsProps } from "./Settings";
import { Welcome, WelcomeProps } from "./Welcome";

export type RouterProps = {
  location: URL;
  loggedIn: boolean;
  feedProps: FeedProps;
  followingProps: FollowingProps;
  welcomeProps: WelcomeProps;
  settingsProps: SettingsProps;
};

export function Router(props: RouterProps) {
  if (props.location.pathname === `${ROOT_PATH}/`) {
    return <Welcome {...props.welcomeProps} />;
  } else if (props.location.pathname === `${ROOT_PATH}/feed`) {
    return <Feed {...props.feedProps} />;
  } else if (props.location.pathname === `${ROOT_PATH}/following`) {
    return <Following {...props.followingProps} />;
  } else if (props.location.pathname === `${ROOT_PATH}/settings`) {
    return <Settings {...props.settingsProps} />;
  }
  return null;
}
