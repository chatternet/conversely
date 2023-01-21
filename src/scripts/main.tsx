import { UseState } from "./commonutils";
import { clearAll } from "./controllers/clear.js";
import { IdToName } from "./controllers/interfaces";
import {
  login,
  loginFromSession,
  logout,
  loginAnonymous,
  changePassword,
  changeDisplayName,
  addFollowing,
  removeFollowing,
  createAccount,
  viewMessage,
  postNote,
  acceptMessage,
  deleteMessage,
  isPasswordless,
} from "./controllers/setup.js";
import { Actor, ActorProps } from "./views/Actor";
import { Feed, FeedProps } from "./views/Feed";
import { Followers, FollowersProps } from "./views/Followers";
import { Following, FollowingProps } from "./views/Following";
import { Settings, SettingsProps } from "./views/Settings";
import { Welcome, WelcomeProps } from "./views/Welcome";
import {
  AlertItem,
  pushAlertTop as pushAlertTopController,
} from "./views/common/AlertTop";
import { CreatePostProps } from "./views/common/CreatePost";
import { CreateSelectAccountProps } from "./views/common/CreateSelectAccount";
import { FormatIdName, FormatIdNameProps } from "./views/common/FormatIdName";
import { HeaderProps } from "./views/common/Header";
import { MessagesListProps } from "./views/common/MessagesList";
import { ScaffoldProps } from "./views/common/Scaffold";
import { ChatterNet, Model } from "chatternet-client-http";
import { useEffect, useState, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";

function Error404() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 text-white">
      <span className="display-3 me-5">404</span>
      <span className="lead">The requested URL did yield any content.</span>
    </div>
  );
}

function ActorFromRoute(props: Omit<ActorProps, "actorId">) {
  const [searchParams] = useSearchParams();
  const did = searchParams.get("did");
  if (did == null) {
    return <Error404 />;
  }
  const actorId = `${did}/actor`;
  return <Actor {...props} actorId={actorId} />;
}

export function Main() {
  // prettier-ignore
  const [alertTopState, setAlertTopState]:
    UseState<AlertItem[]> =
    useState(new Array());
  // prettier-ignore
  const [loggingIn, setLoggingIn]:
    UseState<boolean> =
    useState(false);
  // prettier-ignore
  const [chatterNet, setChatterNet]:
    UseState<ChatterNet | undefined> =
    useState();
  // prettier-ignore
  const [idToName, setIdToName]:
    UseState<IdToName> =
    useState(new IdToName());
  // prettier-ignore
  const [following, setFollowing]:
    UseState<Set<string>> = 
    useState(new Set());
  // prettier-ignore
  const [accountsDid, setAccountsDid]:
    UseState<string[]> = 
    useState(new Array());
  // prettier-ignore
  const [refreshCount, setRefreshCount]: 
    UseState<number> =
    useState(0);
  // prettier-ignore
  const [newDefaultAccount, setNewDefaultAccount]:
    UseState<boolean> =
    useState(false);

  // one-time setup
  useEffect(() => {
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

  const errorNoChatterNet =
    "Operation not complete because no account is logged in.";

  const pushAlertTop = (message: ReactNode) =>
    pushAlertTopController(message, setAlertTopState);

  const loggedIn = !!chatterNet;
  const did = !chatterNet ? undefined : chatterNet.getLocalDid();
  const localActorId = !did ? undefined : ChatterNet.actorFromDid(did);
  const didName = !chatterNet
    ? undefined
    : { id: chatterNet.getLocalDid(), name: chatterNet.getLocalName() };

  const formatIdNameProps: Omit<FormatIdNameProps, "id"> = {
    idToName,
    localActorId,
    contacts: following,
    addFollowing: async (id: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet);
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
    alertTopProps: {
      items: alertTopState,
      setItems: setAlertTopState,
    },
  };

  const messagesListProps: Omit<
    MessagesListProps,
    "pageSize" | "allowMore" | "refreshCount" | "messagesDisplayProps"
  > = {
    loggedIn: !!chatterNet,
    actorId: undefined,
    buildMessageIter: async (actorId?: string) => {
      return actorId != null
        ? chatterNet?.buildMessageIterFrom(actorId)
        : chatterNet?.buildMessageIter();
    },
    setIdToName,
    acceptMessage: async (
      message: Model.Message,
      allowActorId?: string,
      allowAudienceId?: string
    ) => {
      if (!chatterNet) return false;
      return await acceptMessage(
        chatterNet,
        message,
        allowActorId,
        allowAudienceId
      );
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
        pushAlertTop(errorNoChatterNet);
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

  const scaffoldProps: Omit<ScaffoldProps, "children"> = {
    backsplash: false,
    headerProps,
  };

  const welcomeProps: WelcomeProps = {
    loggedIn,
    localActorId,
    newDefaultAccount,
    formatIdNameProps,
    messagesListProps: {
      ...messagesListProps,
      messagesDisplayProps,
      refreshCount,
    },
    createSelectAccountProps,
    scaffoldProps,
  };

  const feedProps: FeedProps = {
    loggedIn,
    createPostProps,
    messagesListProps: {
      ...messagesListProps,
      messagesDisplayProps,
      refreshCount,
    },
    scaffoldProps,
  };

  const actorProps: Omit<ActorProps, "actorId"> = {
    loggedIn,
    formatIdNameProps,
    messagesListProps: {
      ...messagesListProps,
      messagesDisplayProps,
      refreshCount,
    },
    scaffoldProps,
  };

  const followingProps: FollowingProps = {
    localActorId,
    following,
    formatIdNameProps: {
      ...formatIdNameProps,
      addFollowing: undefined,
      contacts: undefined,
    },
    followDid: async (did: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet);
        return;
      }
      const id = `${did}/actor`;
      if (await addFollowing(chatterNet, id, setFollowing, pushAlertTop)) {
        pushAlertTop(
          <span>
            Following{" "}
            <FormatIdName
              id={id}
              {...formatIdNameProps}
              addFollowing={undefined}
            />
          </span>
        );
      }
    },
    unfollowId: async (id: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet);
        return;
      }
      await removeFollowing(chatterNet, id, setFollowing);
      pushAlertTop(
        <span>
          Stopped following{" "}
          <FormatIdName
            id={id}
            {...formatIdNameProps}
            addFollowing={undefined}
          />
        </span>
      );
    },
    scaffoldProps,
  };

  const followersProps: FollowersProps = {
    pageSize: 32,
    buildPageIter: !!chatterNet
      ? () => {
          return chatterNet.buildFollowersIter();
        }
      : undefined,
    formatIdNameProps,
    scaffoldProps,
  };

  const settingsProps: SettingsProps = {
    loggedIn: !!chatterNet,
    changeDisplayName: async (newDisplayName: string) => {
      if (!chatterNet) {
        pushAlertTop(errorNoChatterNet);
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
        pushAlertTop(errorNoChatterNet);
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
    scaffoldProps,
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome {...welcomeProps} />,
    },
    {
      path: "/feed",
      element: <Feed {...feedProps} />,
    },
    {
      path: "/following",
      element: <Following {...followingProps} />,
    },
    {
      path: "/followers",
      element: <Followers {...followersProps} />,
    },
    {
      path: "/settings",
      element: <Settings {...settingsProps} />,
    },
    {
      path: "/actor",
      element: <ActorFromRoute {...actorProps} />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);

  return <RouterProvider router={router} />;
}

const container = document.getElementById("root-home");
const root = createRoot(container!);
root.render(<Main />);
