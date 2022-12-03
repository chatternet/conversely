import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import type { SetState } from "../commonutils";
import type { IdToName, PushAlertTop } from "./interfaces";
import type { LoginInfo } from "./interfaces";
import { ChatterNet, DidKey, Messages } from "chatternet-client-http";
import { sample } from "lodash-es";

export async function getFollows(chatterNet: ChatterNet): Promise<Set<string>> {
  const { message } = await chatterNet.buildFollows();
  return new Set(message.object);
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
    const chatterNet = await ChatterNet.new(loginInfo.did, loginInfo.password, [
      {
        url: "http://127.0.0.1:3030/api",
        did: "did:key:z6MkmAcyo7DKv1FAoux9wAbbTDsij1AszZCtMXeBJxAYTyx3",
        // url: "https://conversely.social/api",
        // did: "did:key:z6MkuNDW7uBZv1CnS7KthMVEbkhyCK1ZTXFnEVtyJJqPvRC7",
      },
    ]);
    const timestamp = new Date().getTime() * 1e-3;
    setIdToName((x) =>
      x.update(
        ChatterNet.actorFromDid(chatterNet.getLocalDid()),
        chatterNet.getLocalName(),
        timestamp
      )
    );
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
  pushAlertTop("Password changed.", "primary");
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
  await chatterNet.storeMessageObjectDoc(await chatterNet.buildActor());
  chatterNet
    .postMessageObjectDoc(await chatterNet.buildActor())
    .catch(() => {});
  const timestamp = new Date().getTime() * 1e-3;
  const actorId = ChatterNet.actorFromDid(chatterNet.getLocalDid());
  setIdToName((x) => x.update(actorId, chatterNet.getLocalName(), timestamp));
  pushAlertTop("Name changed.", "primary");
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
    .postMessageObjectDoc(await chatterNet.newFollow(id))
    .catch(() => {});
  setFollows((x) => new Set([...x, id]));
  pushAlertTop(`Following ${id}.`, "primary");
}

export async function postNote(
  chatterNet: ChatterNet,
  note: string,
  setRefreshCountFeed: SetState<number>
) {
  const objectDoc = await chatterNet?.newNote(note);
  // store local posts to local
  await chatterNet.storeMessageObjectDoc(objectDoc);
  chatterNet.postMessageObjectDoc(objectDoc).catch(() => {});
  // propagate message to UI that feed was updated
  setRefreshCountFeed((prevState) => prevState + 1);
}

export async function viewMessage(
  chatterNet: ChatterNet,
  message: Messages.MessageWithId
) {
  const viewMessage = await chatterNet.newViewMessage(message);
  if (!viewMessage) return;
  // post view message
  chatterNet
    .postMessageObjectDoc({ message: viewMessage, objects: [] })
    .catch(() => {});
  // also post the origin message and objects
  const objects: Messages.ObjectDocWithId[] = [];
  for (const objectId of message.object) {
    const objectDoc = await chatterNet.getObjectDoc(objectId);
    // in some case the object might no longer be available
    if (!objectDoc) continue;
    objects.push(objectDoc);
  }
  chatterNet.postMessageObjectDoc({ message, objects }).catch(() => {});
}
