import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useHistory } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react';
import './login.scss'
import { validateLoginForm, validateEmail, validate2FA, initUser } from './LoginUtils';
import { getHeaders } from '../../lib/utils/auth';
import { toast } from 'react-toastify';
import { generateNewKeys } from '../../lib/services/pgp.service';
import { decryptText, decryptTextWithKey, encryptText, passToHash } from '../../lib/utils/data';
import aes from '../../lib/utils/aes';
import { analytics } from '../../lib/utils/analytics';
import Settings from '../../lib/utils/settings';
import { storeTeamsInfo } from '../../lib/services/teams.service';
import { decryptPGP } from '../../lib/utils/pgp';

export interface ILogin {
  email?: string,
  password?: string,
  handleKeySaved?: (user: any) => void,
  isAuthenticated: boolean
}

export interface IFormInputs {
  email: string,
  password: string
}

const Login = (props: ILogin) => {
  const [formInputValues, setFormInputValues] = useState<IFormInputs>({ email: '', password: '' })
  const [isValid, setIsValid] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated)
  const [token, setToken] = useState('')
  const [isLogging, setIsLogging] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [xuser, setxUser] = useState<any>({})
  const [registerCompleted, setRegisterCompleted] = useState(true)
  const [isTeam, setIsTeam] = useState(true)
  const history = useHistory()

  const generateKeys = async (password: string) => {
    const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await generateNewKeys()

    return {
      privateKeyArmored,
      privateKeyArmoredEncrypted: aes.encrypt(privateKeyArmored, password, false),
      publicKeyArmored,
      revocationCertificate
    };
  }

  const check2FANeeded = (): Promise<any> => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: getHeaders(true, true),
      body: JSON.stringify({ email: formInputValues.email })
    }).then(async res => {
      const data = await res.json()

      if (res.status !== 200) {
        /* window.analytics.track('user-signin-attempted', {
          status: 'error',
          msg: data.error ? data.error : 'Login error'
        }) */
        throw new Error(data.error ? data.error : 'Login error')
      }

      return data;
    }).then(res => {
      if (!res.tfa) {
        doLogin()
      } else {
        setShowTwoFactor(true)
      }
    }).catch(err => {
      if (err.message.includes('not activated') && validateEmail(formInputValues.email)) {
        history.push(`/activate/${formInputValues.email}`)
      } else {
        setIsLogging(false)
        /* window.analytics.track('user-signin-attempted', {
          status: 'error',
          msg: err.message
        }) */
        toast.warn(`"${err}"`)
      }
    })
  }

  const doLogin = async () => {
    // Proceed with submit
    fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'post',
      headers: getHeaders(false, false),
      body: JSON.stringify({ email: formInputValues.email })
    }).then(response => {
      if (response.status === 400) {
        return response.json().then((body) => {
          throw Error(body.error || 'Cannot connect to server');
        });
      } else if (response.status !== 200) {
        throw Error('This account doesn\'t exists');
      }

      return response.json();
    }).then(async (body) => {
      // Manage credentials verification
      const keys = await generateKeys(formInputValues.password);

      // Check password
      const salt = decryptText(body.sKey);
      const hashObj = passToHash({ password: formInputValues.password, salt });
      const encPass = encryptText(hashObj.hash);

      return fetch(`${process.env.REACT_APP_API_URL}/api/access`, {
        method: 'post',
        headers: getHeaders(false, false),
        body: JSON.stringify({
          email: formInputValues.email,
          password: encPass,
          tfa: twoFactorCode,
          privateKey: keys.privateKeyArmoredEncrypted,
          publicKey: keys.publicKeyArmored,
          revocateKey: keys.revocationCertificate
        })
      }).then(async res => {
        return { res, data: await res.json() };
      }).then(res => {
        if (res.res.status !== 200) {
          /* window.analytics.track('user-signin-attempted', {
            status: 'error',
            msg: res.data.error ? res.data.error : 'Login error'
          }); */
          throw new Error(res.data.error ? res.data.error : res.data);
        }
        return res.data;
      }).then(async data => {
        const privateKey = data.user.privateKey;
        const publicKey = data.user.publicKey;
        const revocateKey = data.user.revocateKey;

        const privkeyDecrypted = Buffer.from(aes.decrypt(privateKey, formInputValues.password)).toString('base64');
        /* analytics.identify(data.user.uuid, {
          email: formInputValues.email,
          platform: 'web',
          referrals_credit: data.user.credit,
          referrals_count: Math.floor(data.user.credit / 5),
          createdAt: data.user.createdAt
        }); */

        // Manage succesfull login
        const user = {
          ...data.user,
          mnemonic: decryptTextWithKey(data.user.mnemonic, formInputValues.password),
          email: formInputValues.email,
          privateKey: privkeyDecrypted,
          publicKey: publicKey,
          revocationKey: revocateKey
        };

        if (props.handleKeySaved) {
          props.handleKeySaved(user);
        }

        Settings.set('xToken', data.token);
        Settings.set('xMnemonic', user.mnemonic);
        Settings.set('xUser', JSON.stringify(user));

        if (user.teams) {
          await storeTeamsInfo();
        }

        if (data.userTeam) {
          const mnemonicDecode = Buffer.from(data.userTeam.bridge_mnemonic, 'base64').toString();
          const mnemonicDecrypt = await decryptPGP(mnemonicDecode);

          const team = {
            idTeam: data.userTeam.idTeam,
            user: data.userTeam.bridge_user,
            password: data.userTeam.bridge_password,
            mnemonic: mnemonicDecrypt.data,
            admin: data.userTeam.admin,
            root_folder_id: data.userTeam.root_folder_id,
            isAdmin: data.userTeam.isAdmin
          };

          Settings.set('xTeam', JSON.stringify(team));
          Settings.set('xTokenTeam', data.tokenTeam);
        }

        /* window.analytics.identify(data.user.uuid, {
          email: formInputValues.email,
          platform: 'web',
          referrals_credit: data.user.credit,
          referrals_count: Math.floor(data.user.credit / 5),
          createdAt: data.user.createdAt
        }, () => {
          window.analytics.track('user-signin', {
            email: formInputValues.email,
            userId: user.uuid
          })
        }) */

        setIsAuthenticated(true)
        setToken(data.token)
        setxUser(user)
        setRegisterCompleted(data.user.registerCompleted)
        setIsTeam(false)
      })
        .then(() => initUser())
        .catch(err => {
          throw Error(`"${err.error ? err.error : err}"`);
        })

    }).catch(err => {
      console.error('Login error. ' + err.message);
      toast.warn('Login error');
    })
  }

  const handleChange = (event: any) => {
    setFormInputValues(prevState => ({ ...prevState, [event.target.id]: event.target.value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('submit')
    setIsLogging(true)
    check2FANeeded()
  }

  useEffect(() => {
    // Check if recent login is passed and redirect user to Internxt Drive
    const mnemonic = Settings.get('xMnemonic')
    const user = Settings.getUser()

    if (user.registerCompleted && mnemonic && props.handleKeySaved) {
      props.handleKeySaved(user)
      history.push('/app')
    } else if (user.registerCompleted === false) {
      history.push('/appsumo/' + user.email)
    }
  }, [])

  // once user stops typing validate inputs
  useEffect(() => {
    const timeout = setTimeout(() => {
      const isvalid = validateLoginForm(formInputValues)

      setIsValid(isvalid)
    }, 400)

    return () => clearTimeout(timeout)
  }, [formInputValues])

  useEffect(() => {
    if (isAuthenticated && token && xuser) {
      const mnemonic = Settings.get('xMnemonic');

      if (!registerCompleted) {
        history.push('/appsumo/' + formInputValues.email);
      }
      else if (mnemonic) {
        history.push('/app');
      }
    }
  }, [isAuthenticated, xuser, token])

  if (!showTwoFactor) {
    return (
      <div className="login-main">
        <Container className="login-container-box">
          <div className="container-register">
            <p className="container-title">Sign in to Internxt</p>

            <div className="menu-box">
              <button className="on">Sign in</button>
              <button className="off" onClick={(e: any) => { history.push('/new'); }}>Create account</button>
              {/* <a href='https://drive.internxt.com/new' target='_blank' >
                <span className="off">Create account</span>
              </a> */}
            </div>

            <Form className="form-register" onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
              <Form.Row>
                <Form.Group as={Col} controlId="email">
                  <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={formInputValues.email} onChange={handleChange} autoFocus />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="password">
                  <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={formInputValues.password} onChange={handleChange} />
                </Form.Group>
              </Form.Row>

              <Form.Row className="form-register-submit">
                <Form.Group as={Col}>
                  <Button className="on btn-block __btn-new-button" disabled={!isValid || isLogging} type='submit' >{isLogging ? <Spinner animation="border" variant="light" style={{ fontSize: 1, width: '1rem', height: '1rem' }} /> : 'Sign in'}</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </div>
        </Container>

        <Container className="login-container-box-forgot-password">
          <p onClick={(e: any) => {
            history.push('/remove')
          }}>Forgot your password?</p>
        </Container>
      </div>
    )
  } else {
    const isValid = validate2FA(twoFactorCode);

    return (
      <div className="login-main">
        <Container className="login-container-box">
          <div className="container-register">
            <p className="container-title">Security Verification</p>
            <p className="privacy-disclaimer">Enter your 6 digit authenticator code below</p>

            <Form className="form-register container-register two-factor" onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              doLogin()
            }}>
              <Form.Row>
                <Form.Group as={Col} controlId="twoFactorCode">
                  <Form.Control placeholder="Authentication code" required type="text" name="two-factor" autoComplete="off" value={twoFactorCode} onChange={handleChange} />
                </Form.Group>
              </Form.Row>

              <Form.Row className="form-register-submit">
                <Form.Group as={Col}>
                  <Button className="on btn-block __btn-new-button" disabled={!isValid} type="submit">Sign in</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </div>
        </Container>
      </div>
    )
  }
}

export default Login;