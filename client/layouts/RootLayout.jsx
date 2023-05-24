import React, {useContext} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { userContext, categoryContext, pageContext } from "../context";

const RootLayout = () => {
  const { user, setUser } = useContext(userContext);
  const {category} = useContext(categoryContext);
  const { pageInfo } = useContext(pageContext);
  const { pathname: locationURL } = useLocation();

  return (
    <div className="root-layout">
      <header>
        {formatNavBar(locationURL, pageInfo, user, category, setUser)}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )

};

export default RootLayout;

const formatNavBar = (locationURL, pageInfo, user, category, setUser) => {
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
    case `/UserHomePage/${user.username}`: {
      return (
        <nav id='main-nav'>
          {pageInfo.current === '/Activity' && <NavLink to={`/Activity/${user.username}/${category}`} className='nav-link' > Activity Page </NavLink>}
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)} > Log Out </NavLink>
        </nav>
      )
    }
    case `/Activity/${user.username}/${category}`: {
      return (
        <nav id='main-nav'>
          <NavLink to={`/UserHomePage/${user.username}`} className='nav-link' > User Home Page </NavLink>
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
