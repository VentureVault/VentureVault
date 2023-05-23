import React from 'react';

const Activity = ({activityName, locationName, urls}) => {
  // create divs for each url (and possibly description)
  const urlDivs = []
  for (let i = 0; i < urls.length; i++) {
    urlDivs.push(
      <div className='url'>
        {urls[i]}
      </div>
    )
  }
  return (
    <div className='activity'>
      <button className='delete'>X</button>
      <div className='activityName'>
        {activityName}
      </div>
      <div className='locationName'>
        {locationName}
      </div>
      <div>
        {urlDivs}
      </div>
    </div>
  )
};