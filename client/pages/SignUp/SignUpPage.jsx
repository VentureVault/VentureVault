import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext)
  const { pageInfo } = useContext(pageContext);
  const data = useActionData();

  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedSignUp';
  }, [])

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && pageInfo.current === '/SignUpPage') {
      return navigate(`/UserHomePage/${user.username}`);
    }
  }, [user]);

  // After a user submits info and a valid response from the backend has been received, 
  // this useEffect will set the user accordingly
  useEffect(() => {
    if (data?.user !== undefined) {
      setUser(data.user)
      // Update pageInfo to this page on successful submission
      pageInfo.current = '/SignUpPage';
    }
  }, [data]);

  return (
    <div className= 'login-page'>
      <div className="login-container">
        <h1>Venture Vault</h1>
        <h2>Create New Account</h2>
        <Form method='post' action='/SignupPage' className='login-form'>
          <label>
            <span>Username</span>
            <br />
            <input type="username" name="username" placeholder="Enter your username" required />
          </label>
          <br></br>
          <label>
            <span>Password</span>
            <br />
            <input type="password" name="password" placeholder="Enter your password" required />
          </label>
          <br></br>
          <label>
            <span>Nickname</span>
            <br />
            <input type="first_name" name="first_name" placeholder='Enter your nickname' required />
          </label>
          <br></br>
          {data?.error && <p>{data.error}</p>}
            <button>Submit</button>
        </Form>
      </div>
    </div>
  )
};

export const signupAction = async ({ request }) => {
  const submitData = await request.formData();

  //need to store username/password to DB, then

  const res = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: submitData.get('username'),
      password: submitData.get('password'),
      first_name: submitData.get('first_name')
    })
  });
      
  if (res.status === 200) {

    const response = await res.json();

    if (response.status === 'valid') {
      // console.log('Signup was successful!');
      const { username, firstName } = response;
        return {
          user: { username, firstName }
        }
    }
    if (response.status === 'UserNameExists') {
      return { error: 'This username is taken, please choose another' };
    }

    return { error: `The status "${response.status}" sent in the response doesn't match the valid cases.` };
    
    } 

  return { error: 'The server responded with a status other than 200'};
 }

export default SignUpPage;