import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import { localGet, SetState } from "../commonutils";
import type { IdToName, LoginInfo } from "./interfaces";
import { ChatterNet, DidKey, IdName, Model } from "chatternet-client-http";
import { includes, has, remove, sample } from "lodash-es";
import { ReactNode } from "react";

export function getTimestamp(): number {
  return new Date().getTime() * 1e-3;
}

export async function getFollowing(
  chatterNet: ChatterNet
): Promise<Set<string>> {
  const { message } = await chatterNet.buildSetFollows();
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
  newAccount: boolean,
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setIdToName: SetState<IdToName>,
  setFollowing: SetState<Set<string>>,
  pushAlertTop: (x: ReactNode) => void
) {
  if (!loginInfo) return;
  setLoggingIn(true);

  const url = "http://127.0.0.1:3030/api";
  const did = "did:key:z6Mkh8AnWFeKPMHnDVeVF1kuT8pnhTjSVFbH7SrT4CfYiNqg";
  // const url = "https://conversely.social/api";
  // const did = "did:key:z6Mkmi8mefbMQSrBMGb9zYhhLoKrT1ETqLS24uxDNdcNb9e8";
  const servers = [{ url, did }];

  let chatterNet: ChatterNet | undefined = undefined;

  try {
    chatterNet = await ChatterNet.new(
      loginInfo.did,
      loginInfo.password,
      servers
    );
  } catch {
    pushAlertTop("Failed to login due to invalid DID, password.");
  }

  if (chatterNet == null) {
    setLoggingIn(false);
    return;
  }

  updatePasswordless(loginInfo);

  const timestamp = getTimestamp();

  try {
    const serverActor = await chatterNet.getActor(`${did}/actor`);
    if (serverActor == null) throw Error("server has no actor");
    const serverName = serverActor.name;
    if (serverName == null) throw Error("server has no name");
    chatterNet.newFollow({
      id: serverActor.id,
      name: serverName,
      timestamp: getTimestamp(),
    });
    setIdToName((x) => x.update(serverActor.id, serverName, timestamp));
  } catch {
    pushAlertTop("Failed to connect to servers.");
  }

  if (newAccount) {
    const actorMessageDocuments = await chatterNet.buildActor();
    (async () => {
      await chatterNet.storeMessageDocuments(actorMessageDocuments);
      await chatterNet.postMessageDocuments(actorMessageDocuments);
    })().catch((x) => console.error(x));
  }

  const actorId = ChatterNet.actorFromDid(chatterNet.getLocalDid());
  const actorName = chatterNet.getLocalName();
  for (const [id, name] of await ChatterNet.getIdToName()) {
    setIdToName((x) => x.update(id, name, timestamp));
  }
  setIdToName((x) => x.update(actorId, actorName, timestamp));
  setFollowing(await getFollowing(chatterNet));
  setChatterNet(chatterNet);

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
  setFollowing: SetState<Set<string>>,
  pushAlertTop: (x: ReactNode) => void
) {
  const loginInfoData = sessionStorage.getItem("loginInfo");
  if (!loginInfoData) return;
  const loginInfo: LoginInfo = JSON.parse(loginInfoData);
  await login(
    loginInfo,
    false,
    setLoggingIn,
    setChatterNet,
    setIdToName,
    setFollowing,
    pushAlertTop
  );
}

export async function createAccount(
  displayName: string,
  password: string,
  confirmPassword: string,
  pushAlertTop: (x: ReactNode) => void
): Promise<string | undefined> {
  if (!displayName) {
    pushAlertTop("Display name is empty.");
    return;
  }
  if (password !== confirmPassword) {
    pushAlertTop("Passwords do not match.");
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
  setFollowing: SetState<Set<string>>,
  pushAlertTop: (x: ReactNode) => void
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
    true,
    setLoggingIn,
    setChatterNet,
    setIdToName,
    setFollowing,
    pushAlertTop
  );
}

export async function changePassword(
  chatterNet: ChatterNet,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  pushAlertTop: (x: ReactNode) => void
) {
  if (newPassword !== confirmPassword) {
    pushAlertTop("Passwords do not match.");
    return;
  }
  try {
    await chatterNet.changePassword(oldPassword, newPassword);
  } catch {
    pushAlertTop("Current password is incorrect.");
    return;
  }
  const loginInfo: LoginInfo = {
    did: chatterNet.getLocalDid(),
    password: newPassword,
  };
  sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
  updatePasswordless(loginInfo);
  pushAlertTop("Password changed.");
}

export async function changeDisplayName(
  chatterNet: ChatterNet,
  newDisplayName: string,
  setIdToName: SetState<IdToName>,
  pushAlertTop: (x: ReactNode) => void
) {
  if (!newDisplayName) {
    pushAlertTop("Display name is empty.");
    return;
  }
  const messageDocuments = await chatterNet.changeName(newDisplayName);
  // store name in local
  await chatterNet.storeMessageDocuments(messageDocuments);
  chatterNet.postMessageDocuments(messageDocuments).catch((x) => {
    console.error(x);
  });
  const timestamp = getTimestamp();
  const actorId = ChatterNet.actorFromDid(chatterNet.getLocalDid());
  setIdToName((x) => x.update(actorId, chatterNet.getLocalName(), timestamp));
  pushAlertTop("Name changed.");
}

export async function updateIdName(
  chatterNet: ChatterNet,
  idName: IdName,
  setIdToName: SetState<IdToName>
) {
  // this doesn't add a name, only updates existing ones
  await chatterNet.updateIdName(idName);
  // this adds the name to the session state and updates as necessary
  setIdToName((x) => x.update(idName.id, idName.name, idName.timestamp));
}

export async function newTag(
  chatterNet: ChatterNet,
  name: string,
  setIdToName: SetState<IdToName>
): Promise<Model.Tag30> {
  const timestamp = getTimestamp();
  const tag = await chatterNet.buildTag(name);
  // track the name at least for the duration of the session
  await updateIdName(
    chatterNet,
    { id: tag.id, name: tag.name, timestamp },
    setIdToName
  );
  return tag;
}

export async function follow(
  chatterNet: ChatterNet,
  idName: IdName,
  setFollowing: SetState<Set<string>>,
  setIdToName: SetState<IdToName>
): Promise<boolean> {
  // don't need to store follows as they are managed separately
  chatterNet
    .postMessageDocuments(await chatterNet.newFollow(idName))
    .catch(() => {});
  setFollowing(await getFollowing(chatterNet));
  updateIdName(chatterNet, idName, setIdToName);
  return true;
}

export async function addContact(
  chatterNet: ChatterNet,
  id: string,
  setFollowing: SetState<Set<string>>,
  setIdToName: SetState<IdToName>,
  pushAlertTop: (x: ReactNode) => void
): Promise<boolean> {
  if (!id) {
    pushAlertTop("Follow ID is empty.");
    return false;
  }
  if (!id.startsWith("did:") || !id.endsWith("/actor")) {
    pushAlertTop("Follow ID is invalid.");
    return false;
  }
  const timestamp = getTimestamp();
  await follow(chatterNet, { id, timestamp }, setFollowing, setIdToName);
  // don't need to store follows as they are managed separately
  chatterNet
    .postMessageDocuments(await chatterNet.newFollow({ id, timestamp }))
    .catch(() => {});
  setFollowing(await getFollowing(chatterNet));
  updateIdName(chatterNet, { id, timestamp }, setIdToName);
  return true;
}

export async function addInterest(
  chatterNet: ChatterNet,
  tag: Model.Tag30,
  setFollowing: SetState<Set<string>>
) {
  const timestamp = getTimestamp();
  // don't need to store follows as they are managed separately
  chatterNet
    .postMessageDocuments(
      await chatterNet.newFollow({ id: tag.id, name: tag.name, timestamp })
    )
    .catch(() => {});
  setFollowing(await getFollowing(chatterNet));
}

export async function removeFollowing(
  chatterNet: ChatterNet,
  id: string,
  setFollowing: SetState<Set<string>>
) {
  // don't need to store follows as they are managed separately
  chatterNet
    .postMessageDocuments(await chatterNet.newUnfollow(id))
    .catch((x) => {
      console.error(x);
    });
  setFollowing(await getFollowing(chatterNet));
}

export async function postNote(
  chatterNet: ChatterNet,
  note: string,
  setRefreshCountFeed: SetState<number>,
  pushAlertTop: (x: ReactNode) => void,
  toSelf?: boolean,
  tags?: string[],
  inReplyTo?: string
) {
  const toDocuments = toSelf ? await chatterNet.toSelf() : [];
  for (const tag of tags ?? []) {
    if (tag.split("").length > 30) {
      pushAlertTop(`The tag ${tag} has more than 30 characters.`);
      continue;
    }
    toDocuments.push(await Model.newTag30(tag));
  }
  if (!toSelf && toDocuments.length === 0) {
    pushAlertTop(
      "The note has no valid tags and is not addressed to self. It will be received by no one."
    );
    return;
  }
  const document = await chatterNet?.newNote(note, toDocuments, inReplyTo);
  // store local posts to local
  await chatterNet.storeMessageDocuments(document);
  chatterNet.postMessageDocuments(document).catch(() => {
    pushAlertTop(
      "Failed to post note. \
      The server could be down, \
      or the post content could be invalid."
    );
  });
  // propagate message to UI that feed was updated
  setRefreshCountFeed((prevState) => prevState + 1);
}

export async function acceptMessage(
  chatterNet: ChatterNet,
  message: Model.Message,
  allowActorId?: string,
  allowAudienceId?: string
) {
  if (await chatterNet.isDeleted(message.id)) return false;
  if (message.to?.length === 0) return false;
  const { fromContact, inAudience } = await chatterNet.buildMessageAffinity(
    message
  );
  const fromAllowedContact =
    allowActorId != null && message.actor === allowActorId;
  const inAllowedAudienceId =
    allowAudienceId != null && includes(message.to, allowAudienceId);
  if (!(fromContact || fromAllowedContact)) return false;
  if (!(inAudience || inAllowedAudienceId)) return false;
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
  // build the message to request deletion on the network
  // delete the message locally
  await chatterNet.deleteLocalId(messageId, true);
  const messageDocuments = { message: deleteMessage, documents: [] };
  // propagate the delete message
  await chatterNet.storeMessageDocuments(messageDocuments);
  chatterNet
    .postMessageDocuments(messageDocuments)
    .catch((x) => console.error(x));
}
