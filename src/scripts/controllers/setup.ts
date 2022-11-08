import { default as ANIMAL_NAMES } from "../../assets/alliterative-animals.json";
import type { SetState } from "../commonutils";
import type { ErrorState } from "./interfaces";
import type { LoginInfo, IdNameSuffix } from "./interfaces";
import { ChatterNet, DidKey } from "chatternet-client-http";
import { random, sample } from "lodash-es";

export async function login(
  loginInfo: LoginInfo | undefined,
  setLoggingIn: SetState<boolean>,
  setChatterNet: SetState<ChatterNet | undefined>,
  setDidNameSuffix: SetState<IdNameSuffix | undefined>
) {
  if (!loginInfo) return;
  setLoggingIn(true);
  const chatterNet = await ChatterNet.new(
    loginInfo.did,
    loginInfo.password,
    2,
    ["http://127.0.0.1:3030"]
  );
  chatterNet
    .getIdNameSuffix(loginInfo.did)
    .then(setDidNameSuffix)
    .catch((x) => console.error(x));
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
  setDidNameSuffix: SetState<IdNameSuffix | undefined>
) {
  const loginInfoData = sessionStorage.getItem("loginInfo");
  if (!loginInfoData) return;
  const loginInfo: LoginInfo = JSON.parse(loginInfoData);
  await login(loginInfo, setLoggingIn, setChatterNet, setDidNameSuffix);
}

export async function createAccount(
  displayName: string,
  password: string,
  confirmPassword: string,
  setErrorState: SetState<ErrorState | undefined>
): Promise<string | undefined> {
  if (!displayName) {
    setErrorState({
      title: "Create account",
      message: "Lacking a display name.",
      display: true,
    });
    return;
  }
  if (password !== confirmPassword) {
    setErrorState({
      title: "Create account",
      message: "Passwords do not match.",
      display: true,
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
  setDidNameSuffix: SetState<IdNameSuffix | undefined>
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
  await login({ did, password }, setLoggingIn, setChatterNet, setDidNameSuffix);
}
