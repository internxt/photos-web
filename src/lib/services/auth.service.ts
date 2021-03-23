import { initializeUserPhotos } from "../../screens/Login/LoginUtils";
import { getHeaders } from "../utils/auth";
import Settings from "../utils/settings";

export async function initializeUser(email: string, mnemonic: string, password :string) {
  return fetch(`${process.env.REACT_APP_API_URL}/api/initialize`, {
    method: 'POST',
    headers: getHeaders(true, true),
    body: JSON.stringify({
      email: email,
      mnemonic: mnemonic
    })
  }).then(res => {
    if (res.status !== 200) {
      throw Error(res.statusText);
    }

    initializeUserPhotos()
    return res.json()
  })
}

export function isUserSignedIn() {
  const xUser = Settings.get('xUser');
  const xMnemonic = Settings.get('xMnemonic');
  const xToken = Settings.get('xToken');

  return xUser && xMnemonic && xToken;
}