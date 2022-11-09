import type { UseState } from "../commonutils";
import { clearAll } from "../controllers/clear.js";
import type {
  ErrorState,
  IdNameSuffix,
  Messages,
} from "../controllers/interfaces";
import {
  login,
  loginFromSession,
  logout,
  loginAnonymous,
} from "../controllers/setup.js";
import { Router, RouterProps } from "./Router";
import { ErrorTop } from "./common/ErrorTop";
import { Header, HeaderProps } from "./common/Header";
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
  const [didNameSuffix, setDidNameSuffix]: UseState<IdNameSuffix | undefined> =
    useState();
  // messages currently in the UI
  const [messages, _setMessages]: UseState<Messages | undefined> = useState();
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
        await loginAnonymous(setLoggingIn, setChatterNet, setDidNameSuffix);
      // otherwise try to login from session data
      else
        await loginFromSession(setLoggingIn, setChatterNet, setDidNameSuffix);
      // otherwise user can navigate use account selector
    })().catch((x) => console.error(x));
  }, []);

  const headerProps: HeaderProps = {
    loggedIn: !!chatterNet,
    accountModalProps: {
      loggedIn: !!chatterNet,
      loggingIn,
      loginButtonProps: {
        didNameDisplay: didNameSuffix,
        loggedIn: !!chatterNet,
        loggingIn,
      },
      accountModalInBodyProps: {
        didNameDisplay: didNameSuffix,
        logout: async () => logout(chatterNet, setChatterNet),
      },
      accountModalOutBodyProps: {
        getAccountsName: async () => ChatterNet.getDeviceDidNames(),
        accountSelectorProps: {
          // NOTE: could use `loginInfo` from scope, but instead use the state
          // as seen by the UI component to ensure no surprises
          login: async (did: string, password: string) =>
            login(
              { did, password },
              setLoggingIn,
              setChatterNet,
              setDidNameSuffix
            ),
        },
      },
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
        messagesDisplayProps: {
          languageTag: "en",
          getIdNameSuffix: async (id: string) => {
            if (!chatterNet) throw Error("chatterNet is not initialized");
            return await chatterNet.getIdNameSuffix(id);
          },
        },
      },
    },
    welcomeProps: {
      loggedIn: !!chatterNet,
      didNameSuffix,
      messagesListProps: {
        messagesDisplayProps: {
          languageTag: "en",
          getIdNameSuffix: async (id: string) => {
            if (!chatterNet) throw Error("chatterNet is not initialized");
            return await chatterNet.getIdNameSuffix(id);
          },
        },
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
