import { FormEvent, MouseEvent, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import { updateInfo, validatePassword, validateRegisterFormPart1, readReferalCookie, validateEmail } from "./LoginUtils";
import { toast } from "react-toastify";
import { initializeUser } from "../../lib/services/auth.service";
import { decryptTextWithKey, encryptText, encryptTextWithKey, passToHash } from "../../lib/utils/data";
import Settings from "../../lib/utils/settings";
import aes from "../../lib/utils/aes";
import { getHeaders } from "../../lib/utils/auth";
import { generateNewKeys } from "../../lib/services/pgp.service";
import queryString, { ParsedQuery } from "query-string";
const bip39 = require('bip39')

const CONTAINERS = {
  registerContainer: 1,
  privacyTermsContainer: 2,
  passwordContainer: 3
}

export interface IRegister {
  name: string,
  lastname: string,
  email: string,
  password: string,
  confirmPassword: string
}

interface NewProps {
  match: any,
  location: {
    search: string
  },
  isNewUser: boolean
}

interface NewState {
  isAuthenticated?: boolean,
  register: {
    name: string,
    lastname: string,
    email: string,
    password: string,
    confirmPassword: string
  },
  currentContainer: number,
  validated?: boolean,
  showModal: boolean,
  token?: string,
  user?: any,
  isLoading: boolean,
  checkTermsConditions: boolean
}

const New = (props: NewProps & NewState) => {
  const history = useHistory()
  const [currentContainer, setCurrentContainer] = useState(1)
  const [formInputValues, setFormInputValues] = useState<IRegister>({ name: '', lastname: '', email: '', password: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleChange = (event: any) => {
    setFormInputValues(prevState => ({ ...prevState, [event.target.id]: event.target.value }))
  }

  const doRegister = async () => {
    // Setup hash and salt
    const hashObj = passToHash({ password: formInputValues.password });
    const encPass = encryptText(hashObj.hash);
    const encSalt = encryptText(hashObj.salt);
    // Setup mnemonic
    const mnemonic = bip39.generateMnemonic(256);
    const encMnemonic = encryptTextWithKey(mnemonic, formInputValues.password);

    //Generate keys
    const { privateKeyArmored, publicKeyArmored: codpublicKey, revocationCertificate: codrevocationKey } = await generateNewKeys();

    //Datas
    const encPrivateKey = aes.encrypt(privateKeyArmored, formInputValues.password, false);

    return fetch('/api/register', {
      method: 'post',
      headers: getHeaders(true, true),
      body: JSON.stringify({
        name: formInputValues.name,
        lastname: formInputValues.lastname,
        email: formInputValues.email,
        password: encPass,
        mnemonic: encMnemonic,
        salt: encSalt,
        referral: readReferalCookie(),
        privateKey: encPrivateKey,
        publicKey: codpublicKey,
        revocationKey: codrevocationKey
      })
    }).then(response => {
      if (response.status === 200) {
        response.json().then((body) => {
          // Manage succesfull register
          const { token, user, uuid } = body;

          const privkeyDecrypted = Buffer.from(aes.decrypt(user.privateKey, formInputValues.password)).toString('base64');

          user.privateKey = privkeyDecrypted;

          Settings.set('xToken', token);
          user.mnemonic = decryptTextWithKey(user.mnemonic, formInputValues.password);
          Settings.set('xUser', JSON.stringify(user));
          Settings.set('xMnemonic', user.mnemonic);

          initializeUser(formInputValues.email, user.mnemonic, encPass).then((rootFolderInfo) => {
            user.root_folder_id = rootFolderInfo.user.root_folder_id;
            Settings.set('xUser', JSON.stringify(user));
            history.push('/login');
          })
        })
      } else {
        response.json().then((body) => {
          // Manage account already exists (error 400)
          const { message } = body;

          toast.warn(`"${message}"`);
          setValidated(false)
        });
      }
    }).catch(err => {
      console.error('Register error', err);
    })
  }

  useEffect(() => {
    const parsedQueryParams: ParsedQuery<string> = queryString.parse(history.location.search);
    const isEmailQuery = parsedQueryParams.email && validateEmail(parsedQueryParams.email.toString());

    if (isEmailQuery && parsedQueryParams.email !== formInputValues.email) {
      const newRegister = { ...formInputValues, email: parsedQueryParams.email + '' }

      setFormInputValues(newRegister)
    }

    const xUser = Settings.getUser();
    const xToken = Settings.get('xToken');
    const mnemonic = Settings.get('xMnemonic');
    const haveInfo = (xUser && xToken && mnemonic);

    if (xUser.registerCompleted && (isAuthenticated === true || haveInfo)) {
      history.push('/app');
    }
  }, [])

  const registerContainer = () => (
    <div className="container-register">
      <p className="container-title">Create an Internxt account</p>

      <div className="menu-box">
        <button className="off" onClick={(e) => { history.push('/login') }}>Sign in</button>
        <button className="on">Create account</button>
      </div>

      <Form className="form-register" onSubmit={(e: any) => {
        e.preventDefault()

        if (validateRegisterFormPart1(formInputValues)) {
          let tempReg = formInputValues

          tempReg.email = tempReg.email.toLowerCase().trim()

          setCurrentContainer(CONTAINERS.privacyTermsContainer)
          setFormInputValues(tempReg)
        }
      }}>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Control placeholder="First name" required autoComplete="name"
              onChange={handleChange}
              value={formInputValues.name} autoFocus />
          </Form.Group>

          <Form.Group as={Col} controlId="lastname">
            <Form.Control placeholder="Last name" required autoComplete="lastname"
              onChange={handleChange}
              value={formInputValues.lastname} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="email">
            <Form.Control placeholder="Email address" type="email" required autoComplete="email"
              onChange={handleChange}
              disabled={!props.isNewUser}
              value={formInputValues.email} />
          </Form.Group>
        </Form.Row>

        <Form.Row className="form-register-submit">
          <Form.Group as={Col}>
            <button className="on btn-block" type="submit" disabled={!validateRegisterFormPart1(formInputValues)}>Continue</button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  )

  const privacyContainer = () => (
    <div className="container-register">
      <p className="container-title">Internxt Security</p>
      <p className="privacy-disclaimer">Internxt Drive uses your password to encrypt and decrypt your files. Due to the secure nature of Internxt Drive, we don't know your password. That means that if you ever forget it, your files are gone forever. With us, you're the only owner of your files. We strongly suggest you to:</p>

      <ul className="privacy-remainders">
        <li>Store your Password. Keep it safe and secure.</li>
        <li>Keep an offline backup of your password.</li>
      </ul>

      <Form onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCurrentContainer(CONTAINERS.passwordContainer)
      }}>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <button className="btn-block off"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                setCurrentContainer(CONTAINERS.registerContainer)
              }}>Back</button>
          </Form.Group>

          <Form.Group as={Col}>
            <button className="btn-block on" type="submit" autoFocus>Continue</button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  )

  const passwordContainer = () => (
    <div className="container-register">
      <p className="container-title">Create an Internxt account</p>

      <div className="menu-box">
        <button className="off" onClick={(e: MouseEvent<HTMLButtonElement>) => { /* setState({ currentContainer: loginContainer() }) */ }}>Sign in</button>
        <button className="on">Create account</button>
      </div>

      <Form className="form-register" onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        if (!validatePassword(formInputValues)) {
          return toast.warn('Password missmatch')
        }

        if (!props.isNewUser) {
          updateInfo(formInputValues).then(() => {
            history.push('/login')
          }).catch(err => {
            toast.error(<div><div>Reason: {err.message}</div>  <div>Please contact us</div></div>, {
              autoClose: false,
              closeOnClick: false
            })
          }).finally(() => {
            setIsLoading(false)
          })
        }
        else {
          doRegister();
        }
      }}>
        <Form.Row>
          <Form.Control type="hidden" name="username" autoComplete="username" value={formInputValues.email} />
          <Form.Group as={Col} controlId="password">
            <Form.Control type="password" required placeholder="Password" autoComplete="new-password" onChange={handleChange} autoFocus />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Control type="password" required placeholder="Confirm password" autoComplete="confirm-password" onChange={handleChange} />
          </Form.Group>
        </Form.Row>
        <Form.Row className="form-register-submit">
          <Form.Group as={Col}>
            <Button className="btn-block off" onClick={(e: any) => {
              e.preventDefault()
              setCurrentContainer(CONTAINERS.privacyTermsContainer)
            }}>Back</Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button className="btn-block on __btn-new-button" type="submit" disabled={isLoading}>Continue</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div >
  )

  return (
    <div className="login-main">
      <Container className="login-container-box">
        {currentContainer === CONTAINERS.registerContainer ? registerContainer() : ''}
        {currentContainer === CONTAINERS.privacyTermsContainer ? privacyContainer() : ''}
        {currentContainer === CONTAINERS.passwordContainer ? passwordContainer() : ''}
      </Container>

      <Container className="login-container-box-forgot-password">
        <p className="forgotPassword"></p>
      </Container>
    </div>
  );
}

export default New