import React, {useState, useContext, useEffect} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { userContext, categoryContext, pageContext } from "../context";

const RootLayout = () => {
  const { user, setUser } = useContext(userContext);
  const {category} = useContext(categoryContext);
  const { pageInfo } = useContext(pageContext);
  const { pathname: locationURL } = useLocation();
  const [ userHomePage, setUserHomePage ] = useState(`/UserHomePage/`);
  const [ activity, setActivity ] = useState(`/Activity/`);


  console.log(locationURL)

  // let userHomePage, activity;
  useEffect(() => {
    if (user?.username && category) {
      setActivity(`/Activity/${user.username}/${category}`)
    } else {
      setActivity(`/Activity/`)
    }
    
    if (user?.username) {
      setUserHomePage(`/UserHomePage/${user.username}`)
    } else {
      setUserHomePage(`/UserHomePage/`)
    }
  }, [user, category])

  return (
    <div className="root-layout">
      <header>
        {formatNavBar(locationURL, pageInfo, user, category, setUser, userHomePage, activity)}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )

};

export default RootLayout;

const formatNavBar = (locationURL, pageInfo, user, category, setUser, userHomePage, activity) => {
  switch (locationURL) {
    case '/': {
      return (
        <nav id='main-nav'>
          <NavLink to='/SignUpPage' className='nav-link' > Sign-up Page </NavLink>
        </nav>
      )
    }
    case '/SignUpPage': {
      return (
        <nav id='main-nav'>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
        </nav>
      )
    }
    case `${userHomePage}`: {
      return (
        <nav id='main-nav'>
          {pageInfo.current === '/Activity' && <NavLink to={`${activity}`} className='nav-link' > Activity Page </NavLink>}
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)} > Log Out </NavLink>
        </nav>
      )
    }
    case `${activity}`: {
      return (
        <nav id='main-nav'>
          <NavLink to={`${userHomePage}`} className='nav-link' > User Home Page </NavLink>
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)} > Log Out </NavLink>
        </nav>
      )
    }
    default: {
      return (
        // If you see links to both of the below page at once, it means none of the other paths match the currrent location
        <nav id='main-nav'>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
          <NavLink to='/SignUpPage' className='nav-link' > Sign-up Page </NavLink>
        </nav>
      )
    }
  }
}
