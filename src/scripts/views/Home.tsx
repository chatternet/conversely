import type { UseState } from "../commonutils";
import { clearAll } from "../controllers/clear.js";
import type { ErrorState } from "../controllers/interfaces";
import {
  login,
  loginFromSession,
  logout,
  loginAnonymous,
  changePassword,
  changeDisplayName,
  followActorId,
  createAccount,
} from "../controllers/setup.js";
import { Router, RouterProps } from "./Router";
import { ErrorTop } from "./common/ErrorTop";
import { Header, HeaderProps } from "./common/Header";
import { MessagesListProps } from "./common/MessagesList";
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
  // used to signal the message lists to refresh
  const [refreshCountWelcome]: UseState<number> = useState(0);
  const [refreshCountFeed, setRefreshCountFeed]: UseState<number> = useState(0);

  // one-time setup
  useEffect(() => {
    window.addEventListener("popstate", () =>
      setLocation(new URL(window.location.href))
    );
    (async () => {
      // if no accounts are available, create anonymous
      if ((await ChatterNet.getDeviceDidNames()).length <= 0)
        await loginAnonymous(
          setLoggingIn,
          setChatterNet,
          setDidName,
          setErrorState
        );
      // otherwise try to login from session data
      else
        await loginFromSession(
          setLoggingIn,
          setChatterNet,
          setDidName,
          setErrorState
        );
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
            login(
              { did, password },
              setLoggingIn,
              setChatterNet,
              setDidName,
              setErrorState
            ),
        },
      },
    },
  };

  const messagesListProps: Omit<
    MessagesListProps,
    "pageSize" | "allowMore" | "refreshCount" | "messagesDisplayProps"
  > = {
    loggedIn: !!chatterNet,
    buildMessageIter: async () => chatterNet?.buildMessageIter(),
    getActor: async (id: string) => chatterNet?.getActor(id),
    getObjectDoc: async (id: string) => chatterNet?.getObjectDoc(id),
  };

  const errorNoChatterNet =
    "Operation not complete because no account is logged in.";

  const routerProps: RouterProps = {
    location,
    loggedIn: !!chatterNet,
    feedProps: {
      loggedIn: !!chatterNet,
      createPostProps: {
        postNote: async (note: string) => {
          if (!chatterNet) {
            setErrorState({ message: errorNoChatterNet });
            return;
          }
          const objectDoc = await chatterNet?.newNote(note);
          await chatterNet.postMessageObjectDoc(objectDoc);
          setRefreshCountFeed((prevState) => prevState + 1);
        },
        setErrorState,
      },
      messagesListProps: {
        refreshCount: refreshCountFeed,
        ...messagesListProps,
        messagesDisplayProps: {
          languageTag: "en",
          addContact: async (id: string) => {
            if (!chatterNet) {
              setErrorState({ message: errorNoChatterNet });
              return;
            }
            await followActorId(chatterNet, id);
          },
        },
      },
    },
    welcomeProps: {
      loggedIn: !!chatterNet,
      didName,
      messagesListProps: {
        refreshCount: refreshCountWelcome,
        ...messagesListProps,
        messagesDisplayProps: {
          languageTag: "en",
        },
      },
      createAccountProps: {
        loggedIn: !!chatterNet,
        loggingIn,
        createAccount: async (displayName, password, confirmPassword) => {
          const did = await createAccount(
            displayName,
            password,
            confirmPassword,
            setErrorState
          );
          if (!did) return;
          await login(
            { did, password },
            setLoggingIn,
            setChatterNet,
            setDidName,
            setErrorState
          );
        },
      },
    },
    settingsProps: {
      loggedIn: !!chatterNet,
      changeDisplayName: async (newDisplayName: string) => {
        if (!chatterNet) {
          setErrorState({ message: errorNoChatterNet });
          return;
        }
        await changeDisplayName(
          chatterNet,
          newDisplayName,
          setDidName,
          setErrorState
        );
      },
      changePassword: async (
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
      ) => {
        if (!chatterNet) {
          setErrorState({ message: errorNoChatterNet });
          return;
        }
        await changePassword(
          chatterNet,
          oldPassword,
          newPassword,
          confirmPassword,
          setErrorState
        );
      },
      clearAll,
      setErrorState,
    },
  };

  return (
    <>
      <div className="bg-white pb-5">
        <Header {...headerProps} />
        {errorState ? (
          <Container className="max-width-lg my-3">
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
