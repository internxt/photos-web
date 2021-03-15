import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useHistory } from 'react-router-dom'
import { useState } from 'react';
import './login.scss'

export interface ILogin {

}

const Login = (props: ILogin) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const history = useHistory()

  const handleChange = () => {

  }

  return (
    <div className="login-main">
      <Container className="login-container-box">
        <div className="container-register">
          <p className="container-title">Sign in to Internxt</p>
          <div className="menu-box">
            <button className="on">Sign in</button>
            <button className="off" onClick={(e: any) => { history.push('/new'); }}>Create account</button>
          </div>
          <Form className="form-register" onSubmit={(e: any) => {

          }}>
            <Form.Row>
              <Form.Group as={Col} controlId="email">
                <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={email} onChange={handleChange} autoFocus />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="password">
                <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={password} onChange={handleChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row className="form-register-submit">
              <Form.Group as={Col}>
                <Button className="on btn-block __btn-new-button" disabled={!isValid || isLogging} type="submit">{isLogging ? <Spinner animation="border" variant="light" style={{ fontSize: 1, width: '1rem', height: '1rem' }} /> : 'Sign in'}</Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
      </Container>

      <Container className="login-container-box-forgot-password">
        <p className="forgotPassword" onClick={(e: any) => {
          history.push('/remove');
        }}>Forgot your password?</p>
      </Container>
    </div>
  )
}

export default Login;