import { toast } from 'react-toastify'
import { encryptText, encryptTextWithKey, passToHash } from "../../lib/utils/data";
import { getHeaders } from "../../lib/utils/auth";
import { initializeUser } from "../../lib/services/auth.service";
import Settings from "../../lib/utils/settings";
import { IRegister } from './New'
import { IFormInputs } from './index' 
const bip39 = require('bip39')

export const validateLoginForm = (formInputValues: IFormInputs) => {
  let isValid = true;
  // Email validation

  if (formInputValues.email.length < 5 || !validateEmail(formInputValues.email)) { isValid = false; }
  // Pass length check
  if (formInputValues.password.length < 1) { isValid = false; }

  return isValid;
}

export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-control-regex
  let emailPattern = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"))@((?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;

  return emailPattern.test(email.toLowerCase());
}

export const validateRegisterFormPart1 = (register: IRegister) => {
  let isValid = true

  if (!register.name || !register.lastname || !register.email) {
    return false
  }

  if (register.name.length < 1 && register.lastname.length < 1) {isValid = false}
  if (register.email.length < 5 || !validateEmail(register.email)) {isValid = false}

  return isValid
}

export const validatePassword = (register: IRegister) => {
  let isValid = true

  if (!register.password || !register.confirmPassword) {
    return false
  }

  if (register.password.length < 1 && register.confirmPassword.length < 1) { isValid = false }
  if (register.password !== register.confirmPassword) {
    toast.warn('Password mismatch')
    isValid = false
  }

  return isValid
}

export const validate2FA = (twoFactorCode: string) => {
  let pattern = /^\d{3}(\s+)?\d{3}$/;

  return pattern.test(twoFactorCode);
}

export const readReferalCookie = () => {
  const cookie = document.cookie.match(/(^| )REFERRAL=([^;]+)/);

  return cookie ? cookie[2] : null;
}

export const updateInfo = (register: IRegister) => {
  // Setup hash and salt
  const hashObj = passToHash({ password: register.password })
  const encPass = encryptText(hashObj.hash)
  const encSalt = encryptText(hashObj.salt)

  // Setup mnemonic
  const mnemonic = bip39.generateMnemonic(256)
  const encMnemonic = encryptTextWithKey(mnemonic, register.password)

  // Body
  const body = {
    name: register.name,
    lastname: register.lastname,
    email: register.email,
    password: encPass,
    mnemonic: encMnemonic,
    salt: encSalt,
    referral: readReferalCookie()
  }

  const fetchHandler = async (res: Response) => {
    const body = await res.text()

    try {
      const bodyJson = JSON.parse(body)

      return { res: res, body: bodyJson }
    } catch {
      return { res: res, body: body }
    }
  }

  return fetch('/api/appsumo/update', {
    method: 'POST',
    headers: getHeaders(true, false),
    body: JSON.stringify(body)
  }).then(fetchHandler).then(({ res, body }) => {
    if (res.status !== 200) {
      throw Error(body.error || 'Internal Server Error')
    } else {
      return body
    }
  }).then(res => {
    const xToken = res.token
    const xUser = res.user

    xUser.mnemonic = mnemonic

    return initializeUser(register.email, xUser.mnemonic, encPass).then((rootFolderInfo) => {
      xUser.root_folder_id = rootFolderInfo.user.root_folder_id
      Settings.set('xToken', xToken)
      Settings.set('xMnemonic', mnemonic)
      Settings.set('xUser', JSON.stringify(xUser))
    })
  })
}