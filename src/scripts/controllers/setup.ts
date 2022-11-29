import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import type { SetState } from "../commonutils";
import type { PushAlertTop } from "./interfaces";
import type { LoginInfo } from "./interfaces";
import { ChatterNet, DidKey, IdName, Messages } from "chatternet-client-http";
import { sample } from "lodash-es";

export async function login(
  loginInfo: LoginInfo | undefined,
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setDidName: SetState<IdName | undefined>,
  pushAlertTop: PushAlertTop
) {
  if (!loginInfo) return;
  setLoggingIn(true);

  let chatterNet = undefined;
  try {
    chatterNet = await ChatterNet.new(loginInfo.did, loginInfo.password, [
      {
        url: "http://127.0.0.1:3030/ap",
        did: "did:key:z6MkmAcyo7DKv1FAoux9wAbbTDsij1AszZCtMXeBJxAYTyx3",
        // url: "https://conversely.social/ap",
        // did: "did:key:z6MkuNDW7uBZv1CnS7KthMVEbkhyCK1ZTXFnEVtyJJqPvRC7",
      },
    ]);
  } catch {
    pushAlertTop("Failed to login due to invalid DID, password.", "danger");
    setLoggingIn(false);
    return;
  }
  const did = chatterNet.getLocalDid();

  setDidName({ id: did, name: chatterNet.getLocalName() });
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
  setDidName: SetState<IdName | undefined>,
  pushAlertTop: PushAlertTop
) {
  const loginInfoData = sessionStorage.getItem("loginInfo");
  if (!loginInfoData) return;
  const loginInfo: LoginInfo = JSON.parse(loginInfoData);
  await login(loginInfo, setLoggingIn, setChatterNet, setDidName, pushAlertTop);
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
  setDidName: SetState<IdName | undefined>,
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
    setDidName,
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
  setDidName: SetState<IdName | undefined>,
  pushAlertTop: PushAlertTop
) {
  if (!newDisplayName) {
    pushAlertTop("Display name is empty.", "danger");
    return;
  }
  await chatterNet.changeName(newDisplayName);
  chatterNet
    .postMessageObjectDoc(await chatterNet.buildActor())
    .catch((x) => console.error(x));
  setDidName({ id: chatterNet.getLocalDid(), name: chatterNet.getLocalName() });
  pushAlertTop("Name changed.", "primary");
}

export async function followId(
  chatterNet: ChatterNet,
  id: string,
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
  chatterNet
    .postMessageObjectDoc(await chatterNet.newFollow(id))
    .catch((x) => console.error(x));
  pushAlertTop(`Following ${id}.`, "primary");
}

export async function viewMessage(
  chatterNet: ChatterNet,
  message: Messages.MessageWithId
) {
  const viewMessage = await chatterNet.newView(message);
  if (!viewMessage) return;
  chatterNet
    .postMessageObjectDoc({ message: viewMessage, objects: [] })
    .catch((x) => console.error(x));
}
