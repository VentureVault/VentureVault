import React, { useState } from 'react';

const Activity = ({activityId, activityName, locationName, urls}) => {
  // complete bucketlist item and save in db
  const [checked, setChecked] = useState(false);
  const completedBucketListItem = () => {
    setChecked(!checked);
  }
  // delete activity on button click functionality
  function deleteActivity() {
    // activity id is needed
    // fetch request to router, provide id

    // expect return of new activityArray
    // render page again with new data
    // expect an updated activity array in response from backend
  }
  // create divs for each url (and possibly description)
  const urlDivs = []
  for (let i = 0; i < urls.length; i++) {
    urlDivs.push(
      <div className='url'>
        {urls[i]}
      </div>
    )
  };

  return (
    <div className='activity'>
      <button onClick={deleteActivity} className='deleteActivity'>X</button>
      <input
        className='checkBox'
        type='checkbox'
        checked={checked}
        onChange={completedBucketListItem}
      />
      <div className='activityName'>
        {activityName}
      </div>
      <div className='locationName'>
        {locationName}
      </div>
      <div className='urlContainer'>
        {urlDivs}
      </div>
    </div>
  )
};

export default Activity;