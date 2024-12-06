import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);

        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    console.log(data);

    await axios({
      method: 'post',
      url: '/admin/login',
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        navigate('/main/movies');
        setStatus('idle');
      })
      .catch((e) => {
        console.log(e);
        setStatus('idle');
        
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Login'>
      <div className='login-main-container'>
        <h3>Sign In</h3>
        <form>
          <div className='login-form-container'>
            <div>
              <div className='login-form-group'>
                <label>E-mail:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && email == '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div>
              <div className='login-form-group'>
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && password == '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className='login-submit-container'>
  <button
    className='login-btn-primary'
    type='button'
    disabled={status === 'loading'}
    onClick={() => {
      if (status === 'loading') {
        return;
      }

      if (email && password) {
        setStatus('loading');
        setTimeout(() => {
          handleLogin({
            type: 'login',
            user: { email, password },
          });
          setStatus('idle');
        }, 2000); 
      } else {
        setIsFieldsDirty(true);
        if (email === '') {
          emailRef.current.focus();
        }

        if (password === '') {
          passwordRef.current.focus();
        }
      }
    }}
  >
    {status === 'idle' ? 'Login' : 'Loading, Please wait...'}
  </button>
</div>
            <div className='register-container'>
              <small>Don't have an account? </small>
              <a href='/register'>
                <small>Register</small>
              </a>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;