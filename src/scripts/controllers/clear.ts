import { clearState } from "../commonutils";

export async function clearAll() {
  sessionStorage.clear();
  localStorage.clear();
  window.indexedDB
    .databases()
    .then((x) => {
      for (const info of x)
        if (info.name) window.indexedDB.deleteDatabase(info.name);
    })
    .catch((x) => console.error(x));
  clearState();
}
