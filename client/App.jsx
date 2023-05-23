import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

//pages, loaders
import Home from './pages/Home';
import PageTwo from './pages/PageTwo'

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


const App = () => {
  return (
      <RouterProvider router={router}/>
  )
}

export default App;
