import Settings from './settings';

function getHeaders(withAuth: Boolean, withMnemonic: Boolean, isTeam: Boolean = false): Headers {
  const headers = new Headers();

  headers.append('content-type', 'application/json; charset=utf-8');
  headers.append('internxt-version', '1.0.0');
  headers.append('internxt-client', 'drive-web');

  if (isTeam) {
    if (withAuth) {
      headers.append('Authorization', `Bearer ${Settings.get('xTokenTeam')}`);
    }

    if (withMnemonic) {
      headers.append('internxt-mnemonic', `${Settings.getTeams().bridge_mnemonic}`);
    }
  } else {
    if (withAuth) {
      headers.append('Authorization', `Bearer ${Settings.get('xToken')}`);
    }

    if (withMnemonic) {
      headers.append('internxt-mnemonic', `${Settings.get('xMnemonic')}`);
    }
  }

  return headers;
}

// CHECK THIS ONCE LAZY LOADING PHOTOS FINISHED
async function getHeadersPhotos(authToken?: string, mnemonic?: string): Promise<Headers> {

  let storedAuthToken;

  if (!authToken) {
    storedAuthToken = process.env.xToken
  } else {
    storedAuthToken = authToken
  }

  let storedMnemonic;

  if (!mnemonic) {
    const xUser = process.env.mnemonic
    const xUserJson = JSON.parse(xUser || '{}')

    storedMnemonic = process.env.mnemonic;
  } else {
    storedMnemonic = mnemonic
  }

  const headers = new Headers()

  headers.append('content-type', 'application/json; charset=utf-8')
  headers.append('internxt-version', '1.0.0')
  headers.append('internxt-client', 'drive-mobile')

  headers.append('Authorization', `Bearer ${storedAuthToken}`);
  headers.append('internxt-mnemonic', storedMnemonic);

  return headers;
}


export {
  getHeaders,
  getHeadersPhotos
}