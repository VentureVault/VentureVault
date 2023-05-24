import React, { useState, useRef } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

//pages, loaders
// import Home from './pages/Home';
import PageTwo from './pages/PageTwo'
import LoginPage, { loginAction } from './pages/Login/LoginPage';
import SignUpPage, { signupAction } from './pages/SignUp/SignUpPage';
import UserHomePage from './pages/UserHome/UserHomePage';
import ActivityPage from './pages/ActivityPage/ActivityPage';
import { ActivitiesLoader, CategoryLoader } from './loaders';


//context
import { userContext, categoryContext, pageContext } from './context';

//layouts
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route
        path='/'
        element={<LoginPage key='LoginPage' />}
        action={loginAction}
      />
      <Route
        path='/SignUpPage'
        element={<SignUpPage key='SignupPage' />}
        action={signupAction}
      />
      <Route
        path='/UserHomePage/:username'
        element={<UserHomePage key='UserHomePage' />}
        loader={ActivitiesLoader}
      />
      <Route
        path='/Activity/:username/:categoryName'
        element={<ActivityPage key='ActivityPage' />}
        loader={CategoryLoader}
      />
      {/* <Route
        path='/PageTwo'
        element={<PageTwo key='PageTwo' />}
      /> */}
    </Route>
  )
)


const App = () => {
  const [user, setUser] = useState(null); 
  const [category, setCategory] = useState(null);
  const pageInfo = useRef(null);

  console.log('user from app', user);

  return (
    <userContext.Provider value={{ user, setUser }}> 
        <categoryContext.Provider value={{ category, setCategory }}>
          <pageContext.Provider value={{pageInfo}}>
            <RouterProvider router={router} />
          </pageContext.Provider>
        </categoryContext.Provider>
    </userContext.Provider>  
  )
}

export default App;
