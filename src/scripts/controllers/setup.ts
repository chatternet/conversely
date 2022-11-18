import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import type { SetState } from "../commonutils";
import type { ErrorState } from "./interfaces";
import type { LoginInfo } from "./interfaces";
import { ChatterNet, DidKey, IdName } from "chatternet-client-http";
import { sample } from "lodash-es";

export async function login(
  loginInfo: LoginInfo | undefined,
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setDidName: SetState<IdName | undefined>,
  setErrorState: SetState<ErrorState | undefined>
) {
  if (!loginInfo) return;
  setLoggingIn(true);

  let chatterNet = undefined;
  try {
    chatterNet = await ChatterNet.new(loginInfo.did, loginInfo.password, [
      "http://127.0.0.1:3030",
    ]);
  } catch {
    setErrorState({
      message: "Failed to login due to invalid DID, password.",
    });
    setLoggingIn(false);
    return;
  }
  const did = chatterNet.getDid();

  // let servers know about self
  chatterNet
    .postMessageObjectDoc(await chatterNet.getActorMessage())
    .catch((x) => console.error(x));
  chatterNet
    .postMessageObjectDoc(await chatterNet.newFollow(`${did}/actor`))
    .catch((x) => console.error(x));

  setDidName({ id: did, name: chatterNet.getName() });
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
  chatterNet.stop();
  setChatterNet(undefined);
}

export async function loginFromSession(
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setDidName: SetState<IdName | undefined>,
  setErrorState: SetState<ErrorState | undefined>
) {
  const loginInfoData = sessionStorage.getItem("loginInfo");
  if (!loginInfoData) return;
  const loginInfo: LoginInfo = JSON.parse(loginInfoData);
  await login(
    loginInfo,
    setLoggingIn,
    setChatterNet,
    setDidName,
    setErrorState
  );
}

export async function createAccount(
  displayName: string,
  password: string,
  confirmPassword: string,
  setErrorState: SetState<ErrorState | undefined>
): Promise<string | undefined> {
  if (!displayName) {
    setErrorState({
      message: "Display name is empty.",
    });
    return;
  }
  if (password !== confirmPassword) {
    setErrorState({
      message: "Passwords do not match.",
    });
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
  setErrorState: SetState<ErrorState | undefined>
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
    setErrorState
  );
}

export async function changePassword(
  chatterNet: ChatterNet,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  setErrorState: SetState<ErrorState | undefined>
) {
  if (newPassword !== confirmPassword) {
    setErrorState({
      message: "Passwords do not match.",
    });
    return;
  }
  if (!(await chatterNet.changePassword(oldPassword, newPassword))) {
    setErrorState({
      message: "Old password is incorrect.",
    });
    return;
  }
  const loginInfo: LoginInfo = {
    did: chatterNet.getDid(),
    password: newPassword,
  };
  sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
}

export async function changeDisplayName(
  chatterNet: ChatterNet,
  newDisplayName: string,
  setDidName: SetState<IdName | undefined>,
  setErrorState: SetState<ErrorState | undefined>
) {
  if (!newDisplayName) {
    setErrorState({
      message: "Display name is empty.",
    });
    return;
  }
  await chatterNet.changeName(newDisplayName);
  chatterNet
    .postMessageObjectDoc(await chatterNet.getActorMessage())
    .catch((x) => console.error(x));
  setDidName({ id: chatterNet.getDid(), name: chatterNet.getName() });
}

export async function followActorId(chatterNet: ChatterNet, id: string) {
  // TODO: store locally
  chatterNet
    .postMessageObjectDoc(await chatterNet.newFollow(id))
    .catch((x) => console.error(x));
}
