import { ROOT_PATH, sleep, UseState } from "../commonutils";
import { clearAll } from "../controllers/clear.js";
import { AlertTopItem, IdToName } from "../controllers/interfaces";
import {
  login,
  loginFromSession,
  logout,
  loginAnonymous,
  changePassword,
  changeDisplayName,
  addFollowing,
  createAccount,
  viewMessage,
  postNote,
  acceptMessage,
  deleteMessage,
  isPasswordless,
} from "../controllers/setup.js";
import { Router, RouterProps } from "./Router";
import {
  AlertTop,
  pushAlertTop as pushAlertTopController,
} from "./common/AlertTop";
import { CreatePostProps } from "./common/CreatePost";
import { CreateSelectAccountProps } from "./common/CreateSelectAccount";
import { FormatIdNameProps } from "./common/FormatIdName";
import { Header, HeaderProps } from "./common/Header";
import { MessagesListProps } from "./common/MessagesList";
import { ChatterNet, Model } from "chatternet-client-http";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

export function Home() {
  // error information to display
  const [alertTopState, setAlertTopState]: UseState<
    AlertTopItem[] | undefined
  > = useState();
  const [loggingIn, setLoggingIn]: UseState<boolean> = useState(false);
  // the networking and storage node
  const [chatterNet, setChatterNet]: UseState<ChatterNet | undefined> =
    useState();
  const [idToName, setIdToName]: UseState<IdToName> = useState(new IdToName());
  const [following, setFollowing]: UseState<Set<string>> = useState(new Set());
  const [accountsDid, setAccountsDid]: UseState<string[]> = useState(
    new Array()
  );
  // the current window location
  const [location, setLocation]: UseState<URL> = useState(
    new URL(window.location.href)
  );
  // used to signal the message lists to refresh
  const [refreshCount, setRefreshCount]: UseState<number> = useState(0);
  const [newDefaultAccount, setNewDefaultAccount]: UseState<boolean> =
    useState(false);

  const pushAlertTop = (message: string, variant: Variant) =>
    pushAlertTopController(message, variant, setAlertTopState);

  // one-time setup
  useEffect(() => {
    window.addEventListener("popstate", () =>
      setLocation(new URL(window.location.href))
    );
    (async () => {
      // prepare list of accounts
      const accounts = await ChatterNet.getAccountNames();
      const timestamp = new Date().getTime() * 1e-3;
      for (const { id, name } of accounts) {
        const actorId = ChatterNet.actorFromDid(id);
        setIdToName((x) => x.update(actorId, name, timestamp));
        setAccountsDid((x) => [...x, id]);
      }
      // login from session if accounts are available
      if (accounts.length > 0) {
        await loginFromSession(
          setLoggingIn,
          setChatterNet,
          setIdToName,
          setFollowing,
          pushAlertTop
        );
        setNewDefaultAccount(false);
      }
      // if no accounts make an anonymous account
      else {
        await loginAnonymous(
          setLoggingIn,
          setChatterNet,
          setIdToName,
          setFollowing,
          pushAlertTop
        );
        setNewDefaultAccount(true);
      }
    })().catch((x) => console.error(x));
  }, []);

  const did = !chatterNet ? undefined : chatterNet.getLocalDid();
  const localActorId = !did ? undefined : ChatterNet.actorFromDid(did);
  const didName = !chatterNet
    ? undefined
    : { id: chatterNet.getLocalDid(), name: chatterNet.getLocalName() };

  const formatIdNameProps: Omit<FormatIdNameProps, "id"> = {
    idToName,
    contacts: following,
    addFollowing: async (id: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet, "danger");
        return;
      }
      await addFollowing(chatterNet, id, setFollowing, pushAlertTop);
    },
  };

  const createSelectAccountProps: CreateSelectAccountProps = {
    createAccountProps: {
      loggedIn: !!chatterNet,
      loggingIn,
      createAccount: async (displayName, password, confirmPassword) => {
        const did = await createAccount(
          displayName,
          password,
          confirmPassword,
          pushAlertTop
        );
        if (!did) return;
        await login(
          { did, password },
          setLoggingIn,
          setChatterNet,
          setIdToName,
          setFollowing,
          pushAlertTop
        );
      },
    },
    selectAccountProps: {
      accountsDid,
      formatIdNameProps: { ...formatIdNameProps, bare: true },
      accountSelectorProps: {
        isPasswordless,
        // NOTE: could use `loginInfo` from scope, but instead use the state
        // as seen by the UI component to ensure no surprises
        login: async (did: string, password: string) =>
          login(
            { did, password },
            setLoggingIn,
            setChatterNet,
            setIdToName,
            setFollowing,
            pushAlertTop
          ),
      },
    },
  };

  const headerProps: HeaderProps = {
    loggedIn: !!chatterNet,
    accountModalProps: {
      loggedIn: !!chatterNet,
      loggingIn,
      loginButtonProps: {
        localActorId,
        formatIdNameProps: { ...formatIdNameProps, bare: true },
        loggedIn: !!chatterNet,
        loggingIn,
      },
      accountModalInBodyProps: {
        didName,
        logout: async () => logout(chatterNet, setChatterNet),
      },
      createSelectAccountProps,
    },
  };

  const messagesListProps: Omit<
    MessagesListProps,
    "pageSize" | "allowMore" | "refreshCount" | "messagesDisplayProps"
  > = {
    loggedIn: !!chatterNet,
    buildMessageIter: async () => chatterNet?.buildMessageIter(),
    setIdToName,
    acceptMessage: async (message: Model.Message) => {
      if (!chatterNet) return false;
      return await acceptMessage(chatterNet, message);
    },
    viewMessage: async (message: Model.Message) => {
      if (!chatterNet) return;
      await viewMessage(chatterNet, message);
    },
    getMessage: async (id: string) => {
      if (!chatterNet) return;
      const message = await chatterNet.getDocument(id);
      if (!Model.isMessage(message)) return;
      if (!Model.verifyMessage(message)) return;
      return message;
    },
    getActor: async (id: string) => chatterNet?.getActor(id),
    getBody: async (id: string) => {
      const body = await chatterNet?.getDocument(id);
      if (!Model.isNote1k(body)) return;
      return body;
    },
    deleteMessage: async (messageId: string) => {
      if (!chatterNet) return;
      await deleteMessage(chatterNet, messageId);
    },
  };

  const createPostProps: CreatePostProps = {
    postNote: async (note: string, inReplyTo?: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet, "danger");
        return;
      }
      await postNote(
        chatterNet,
        note,
        setRefreshCount,
        pushAlertTop,
        inReplyTo
      );
    },
    pushAlertTop,
  };

  const messagesDisplayProps = {
    localActorId,
    languageTag: "en",
    formatIdNameProps,
    createPostProps,
  };

  const errorNoChatterNet =
    "Operation not complete because no account is logged in.";

  const routerProps: RouterProps = {
    location,
    loggedIn: !!chatterNet,
    feedProps: {
      loggedIn: !!chatterNet,
      createPostProps,
      messagesListProps: {
        refreshCount: refreshCount,
        ...messagesListProps,
        messagesDisplayProps,
      },
    },
    followingProps: {
      loggedIn: !!chatterNet,
      following,
      formatIdNameProps: {
        ...formatIdNameProps,
        addFollowing: undefined,
        contacts: undefined,
      },
      followId: async (id: string) => {
        if (!chatterNet) {
          pushAlertTop(errorNoChatterNet, "danger");
          return;
        }
        await addFollowing(chatterNet, id, setFollowing, pushAlertTop);
      },
    },
    followersProps: {
      pageSize: 32,
      buildPageIter: !!chatterNet
        ? () => {
            return chatterNet.buildFollowersIter();
          }
        : undefined,
      formatIdNameProps: {
        ...formatIdNameProps,
        addFollowing: undefined,
        contacts: undefined,
      },
    },
    welcomeProps: {
      loggedIn: !!chatterNet,
      localActorId,
      newDefaultAccount,
      formatIdNameProps: { ...formatIdNameProps, bare: true },
      messagesListProps: {
        refreshCount: refreshCount,
        ...messagesListProps,
        messagesDisplayProps,
      },
      createSelectAccountProps,
    },
    settingsProps: {
      loggedIn: !!chatterNet,
      changeDisplayName: async (newDisplayName: string) => {
        if (!chatterNet) {
          pushAlertTop(errorNoChatterNet, "danger");
          return;
        }
        await changeDisplayName(
          chatterNet,
          newDisplayName,
          setIdToName,
          pushAlertTop
        );
      },
      changePassword: async (
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
      ) => {
        if (!chatterNet) {
          pushAlertTop(errorNoChatterNet, "danger");
          return;
        }
        await changePassword(
          chatterNet,
          oldPassword,
          newPassword,
          confirmPassword,
          pushAlertTop
        );
      },
      clearAll,
    },
  };

  const showBacksplash = location.pathname === `${ROOT_PATH}/`;

  return (
    <>
      <div className="bg-white pb-5">
        <Header {...headerProps} />
        {showBacksplash ? (
          <div style={{ position: "relative", width: "100%", height: 0 }}>
            <div className="backsplash" style={{ position: "absolute" }}></div>
          </div>
        ) : null}
        {alertTopState ? (
          <Container className="max-width-lg my-3">
            <AlertTop state={alertTopState} setState={setAlertTopState} />
          </Container>
        ) : null}
        <Router {...routerProps} />
      </div>
      <footer className="text-center text-light">
        <Container className="max-width-md p-5">Conversely</Container>
      </footer>
    </>
  );
}
