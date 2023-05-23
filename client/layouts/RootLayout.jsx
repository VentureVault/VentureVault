import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const RootLayout = () => {
  return ( 
    <div className="root-layout">
      <header>
        <nav id='main-nav'>
          <NavLink to='/' className='nav-link'>Home</NavLink>
          <NavLink to='/PageTwo' className='nav-link'>Page Two</NavLink>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>

   );
}

export default RootLayout;