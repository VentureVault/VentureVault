import React, { useState, useEffect } from 'react';

// A test page with no purpose other than showing that react-router works and the frontend and backend are communicating

const PageTwo = () => {

  const handleClick = async () => {
    const response = await fetch('/api/activity/get-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'das' })
    });
    if (response.status === 200) {
      const res = await response.json();
      console.log(res);
    } else {
      console.log('fail')
    }
  }

  return (
    <div className='page-two'>
      <h1>This is page two</h1>
      <button onClick={handleClick}>Click me to check backend</button>
    </div>
    );
}

export default PageTwo;