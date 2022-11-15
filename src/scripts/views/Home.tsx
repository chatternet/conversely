import type { UseState } from "../commonutils";
import { clearAll } from "../controllers/clear.js";
import type { ErrorState } from "../controllers/interfaces";
import {
  login,
  loginFromSession,
  logout,
  loginAnonymous,
} from "../controllers/setup.js";
import { Router, RouterProps } from "./Router";
import { ErrorTop } from "./common/ErrorTop";
import { Header, HeaderProps } from "./common/Header";
import type { IdName } from "chatternet-client-http";
import { ChatterNet } from "chatternet-client-http";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

export function Home() {
  // error information to display
  const [errorState, setErrorState]: UseState<ErrorState | undefined> =
    useState();
  const [loggingIn, setLoggingIn]: UseState<boolean> = useState(false);
  // the networking and storage node
  const [chatterNet, setChatterNet]: UseState<ChatterNet | undefined> =
    useState();
  // name and suffix for currently logged in DID
  const [didName, setDidName]: UseState<IdName | undefined> = useState();
  // the current window location
  const [location, setLocation]: UseState<URL> = useState(
    new URL(window.location.href)
  );

  // one-time setup
  useEffect(() => {
    window.addEventListener("popstate", () =>
      setLocation(new URL(window.location.href))
    );
    (async () => {
      // if no accounts are available, create anonymous
      if ((await ChatterNet.getDeviceDidNames()).length <= 0)
        await loginAnonymous(setLoggingIn, setChatterNet, setDidName);
      // otherwise try to login from session data
      else await loginFromSession(setLoggingIn, setChatterNet, setDidName);
      // otherwise user can navigate use account selector
    })().catch((x) => console.error(x));
  }, []);

  const headerProps: HeaderProps = {
    loggedIn: !!chatterNet,
    accountModalProps: {
      loggedIn: !!chatterNet,
      loggingIn,
      loginButtonProps: {
        didName,
        loggedIn: !!chatterNet,
        loggingIn,
      },
      accountModalInBodyProps: {
        didName,
        logout: async () => logout(chatterNet, setChatterNet),
      },
      accountModalOutBodyProps: {
        getAccountsName: async () => ChatterNet.getDeviceDidNames(),
        accountSelectorProps: {
          // NOTE: could use `loginInfo` from scope, but instead use the state
          // as seen by the UI component to ensure no surprises
          login: async (did: string, password: string) =>
            login({ did, password }, setLoggingIn, setChatterNet, setDidName),
        },
      },
    },
  };

  const messagesListProps = {
    buildMessageIter: async () => chatterNet?.buildMessageIter(),
    getIdName: async (id: string) => chatterNet?.getIdName(id),
    getObjectDoc: async (id: string) => chatterNet?.getObjectDoc(id),
    messagesDisplayProps: {
      languageTag: "en",
    },
  };

  const routerProps: RouterProps = {
    location,
    loggedIn: !!chatterNet,
    feedProps: {
      loggedIn: !!chatterNet,
      createPostProps: {
        postMessage: async (_message: string) => {},
      },
      messagesListProps: {
        pageSize: 32,
        ...messagesListProps,
      },
    },
    welcomeProps: {
      loggedIn: !!chatterNet,
      didName,
      messagesListProps: {
        pageSize: 8,
        ...messagesListProps,
      },
    },
    settingsProps: {
      clearAll,
    },
  };

  return (
    <>
      <div className="bg-white pb-5">
        <Header {...headerProps} />
        {errorState ? (
          <Container className="max-width-lg">
            <ErrorTop state={errorState} setState={setErrorState} />
          </Container>
        ) : null}
        <Router {...routerProps} />
      </div>
      <footer className="text-center text-light">
        <Container className="max-width-md p-5">Chit Chatter</Container>
      </footer>
    </>
  );
}
