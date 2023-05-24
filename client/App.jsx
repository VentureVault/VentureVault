import React, { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

//pages, loaders
import Home from './pages/Home';
import PageTwo from './pages/PageTwo'

//context
import { userContext } from './context';

//layouts
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route
        path='/PageTwo'
        element={<PageTwo key='PageTwo' />}
      />
    </Route>
  )
)

// const [ user, setUser ] = useState(null);
//Until signup is set

const App = () => {
  const [user, setUser] = useState('Kasey');
  
  
  return (
    <userContext.Provider value={{ user, setUser }}>  
      <RouterProvider router={router} />
    </userContext.Provider>  
  )
}

export default App;
