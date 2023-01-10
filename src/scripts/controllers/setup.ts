import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import { localGet, SetState } from "../commonutils";
import type { IdToName, LoginInfo, PushAlertTop } from "./interfaces";
import { ChatterNet, DidKey, Model } from "chatternet-client-http";
import { includes, has, remove, sample } from "lodash-es";

export async function getFollows(chatterNet: ChatterNet): Promise<Set<string>> {
  const { message } = await chatterNet.buildFollows();
  return new Set(message.object);
}

function updatePasswordless(loginInfo: LoginInfo) {
  let passwordless: string[] | null = localGet("passwordless");
  if (passwordless == null) passwordless = [];
  if (!loginInfo.password && !has(passwordless, loginInfo.did)) {
    passwordless.push(loginInfo.did);
  } else {
    remove(passwordless, (x) => x === loginInfo.did);
  }
  window.localStorage.setItem("passwordless", JSON.stringify(passwordless));
}

export function isPasswordless(did: string): boolean {
  let passwordless: string[] | null = localGet("passwordless");
  return includes(passwordless, did);
}

export async function login(
  loginInfo: LoginInfo | undefined,
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setIdToName: SetState<IdToName>,
  setFollows: SetState<Set<string>>,
  pushAlertTop: PushAlertTop
) {
  if (!loginInfo) return;
  setLoggingIn(true);

  try {
    // url: "https://conversely.social/api",
    const url = "http://127.0.0.1:3030/api";
    const did = "did:key:z6Mkh8AnWFeKPMHnDVeVF1kuT8pnhTjSVFbH7SrT4CfYiNqg";
    const servers = [{ url, did }];
    const chatterNet = await ChatterNet.new(
      loginInfo.did,
      loginInfo.password,
      servers
    );
    updatePasswordless(loginInfo);
    const timestamp = new Date().getTime() * 1e-3;
    const serverActor = await chatterNet.getActor(`${did}/actor`);
    if (serverActor == null) throw Error("server has no actor");
    const serverName = serverActor.name;
    if (serverName == null) throw Error("server has no name");
    chatterNet.newFollow(serverActor.id);
    setIdToName((x) =>
      x.update(
        ChatterNet.actorFromDid(chatterNet.getLocalDid()),
        chatterNet.getLocalName(),
        timestamp
      )
    );
    setIdToName((x) => x.update(serverActor.id, serverName, timestamp));
    setFollows(await getFollows(chatterNet));
    setChatterNet(chatterNet);
  } catch {
    pushAlertTop("Failed to login due to invalid DID, password.", "danger");
    setLoggingIn(false);
    return;
  }

  setLoggingIn(false);
  sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
}

export async function logout(
  chatterNet: ChatterNet | undefined,
  setChatterNet: SetState<ChatterNet | undefined>
) {
  sessionStorage.removeItem("loginInfo");
  if (!chatterNet) throw Error("chatterNet not initialized");
  setChatterNet(undefined);
}

export async function loginFromSession(
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setIdToName: SetState<IdToName>,
  setFollows: SetState<Set<string>>,
  pushAlertTop: PushAlertTop
) {
  const loginInfoData = sessionStorage.getItem("loginInfo");
  if (!loginInfoData) return;
  const loginInfo: LoginInfo = JSON.parse(loginInfoData);
  await login(
    loginInfo,
    setLoggingIn,
    setChatterNet,
    setIdToName,
    setFollows,
    pushAlertTop
  );
}

export async function createAccount(
  displayName: string,
  password: string,
  confirmPassword: string,
  pushAlertTop: PushAlertTop
): Promise<string | undefined> {
  if (!displayName) {
    pushAlertTop("Display name is empty.", "danger");
    return;
  }
  if (password !== confirmPassword) {
    pushAlertTop("Passwords do not match.", "danger");
    return;
  }
  const key = await DidKey.newKey();
  const did = await ChatterNet.newAccount(key, displayName, password);
  return did;
}

export async function loginAnonymous(
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setIdToName: SetState<IdToName>,
  setFollows: SetState<Set<string>>,
  pushAlertTop: PushAlertTop
): Promise<void> {
  const animalName = sample(
    ANIMAL_NAMES.filter((x) => x.length >= 4 && x.length <= 8)
  );
  if (animalName == null)
    throw Error("anonymous name list did not yield a name");
  const displayName = `anonymous ${animalName}`;
  const password = "";
  const key = await DidKey.newKey();
  const did = await ChatterNet.newAccount(key, displayName, password);
  await login(
    { did, password },
    setLoggingIn,
    setChatterNet,
    setIdToName,
    setFollows,
    pushAlertTop
  );
}

export async function changePassword(
  chatterNet: ChatterNet,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  pushAlertTop: PushAlertTop
) {
  if (newPassword !== confirmPassword) {
    pushAlertTop("Passwords do not match.", "danger");
    return;
  }
  try {
    await chatterNet.changePassword(oldPassword, newPassword);
  } catch {
    pushAlertTop("Current password is incorrect.", "danger");
    return;
  }
  const loginInfo: LoginInfo = {
    did: chatterNet.getLocalDid(),
    password: newPassword,
  };
  sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
  updatePasswordless(loginInfo);
  pushAlertTop("Password changed.", "info");
}

export async function changeDisplayName(
  chatterNet: ChatterNet,
  newDisplayName: string,
  setIdToName: SetState<IdToName>,
  pushAlertTop: PushAlertTop
) {
  if (!newDisplayName) {
    pushAlertTop("Display name is empty.", "danger");
    return;
  }
  await chatterNet.changeName(newDisplayName);
  // store name in local
  await chatterNet.storeMessageDocuments(await chatterNet.buildActor());
  const actor = await chatterNet.buildActor();
  chatterNet.postMessageDocuments(actor).catch((x) => {
    console.error(x);
  });
  const timestamp = new Date().getTime() * 1e-3;
  const actorId = ChatterNet.actorFromDid(chatterNet.getLocalDid());
  setIdToName((x) => x.update(actorId, chatterNet.getLocalName(), timestamp));
  pushAlertTop("Name changed.", "info");
}

export async function addFollowing(
  chatterNet: ChatterNet,
  id: string,
  setFollows: SetState<Set<string>>,
  pushAlertTop: PushAlertTop
) {
  if (!id) {
    pushAlertTop("ID to follow is empty.", "danger");
    return;
  }
  if (id.startsWith("did:") && !id.endsWith("/actor")) {
    pushAlertTop(
      "ID to follow is a DID document and lacks the `/actor` path.",
      "danger"
    );
    return;
  }
  // don't need to store follows as they are managed separately
  chatterNet
    .postMessageDocuments(await chatterNet.newFollow(id))
    .catch(() => {});
  setFollows((x) => new Set([...x, id]));
  pushAlertTop(`Following ${id}.`, "info");
}

export async function postNote(
  chatterNet: ChatterNet,
  note: string,
  setRefreshCountFeed: SetState<number>,
  pushAlertTop: PushAlertTop,
  inReplyTo?: string
) {
  const document = await chatterNet?.newNote(
    note,
    undefined,
    "text/markdown",
    inReplyTo
  );
  // store local posts to local
  await chatterNet.storeMessageDocuments(document);
  chatterNet.postMessageDocuments(document).catch(() => {
    pushAlertTop(
      "Failed to post note. \
      The server could be down, \
      or the post content could be invalid.",
      "danger"
    );
  });
  // propagate message to UI that feed was updated
  setRefreshCountFeed((prevState) => prevState + 1);
}

export async function acceptMessage(
  chatterNet: ChatterNet,
  message: Model.Message
) {
  if (await chatterNet.messageIsDeleted(message.id)) return false;
  const { fromContact, inAudience } = await chatterNet.buildMessageAffinity(
    message
  );
  if (!fromContact || !inAudience) return false;
  return true;
}

export async function viewMessage(
  chatterNet: ChatterNet,
  message: Model.Message
) {
  const viewMessage = await chatterNet.getOrNewViewMessage(message);
  if (!viewMessage) return;
  // post view message
  chatterNet
    .postMessageDocuments({ message: viewMessage, documents: [] })
    .catch((x) => {
      console.error(x);
    });
  // also post the origin objects
  for (const objectId of message.object) {
    const document = await chatterNet.getDocument(objectId);
    // in some case the object might no longer be available
    if (!document) continue;
    chatterNet.postDocument(document).catch((x) => console.error(x));
  }
  // and try to post the actor
  const actor = await chatterNet.getDocument(message.actor);
  if (actor != null) chatterNet.postDocument(actor);
}

export async function deleteMessage(chatterNet: ChatterNet, messageId: string) {
  // build the message to request deletion on the network
  const deleteMessage = await chatterNet.newDelete(messageId);
  // fails if wrong actor or message not known to local
  if (deleteMessage == null) return;
  // build the message to request deletion on the network
  // delete the message locally
  await chatterNet.deleteMessageLocal(messageId);
  const messageDocuments = { message: deleteMessage, documents: [] };
  // propagate the delete message
  await chatterNet.storeMessageDocuments(messageDocuments);
  chatterNet
    .postMessageDocuments(messageDocuments)
    .catch((x) => console.error(x));
}
