import React, { useState } from 'react';

import ActivityContainer from './components/ActivityContainer'

const mockActivityObject = {
  activityName: 'Hike the PCT',
  activityId: 1,
  locationName: 'West coast',
  category: 'Activity',
  url: ['https://www.pcta.org/']
};
const mockActivityArray = [mockActivityObject];

const ActivityPage = () => {

  const [activityArray, setActivityArray] = useState(mockActivityArray); // *** change for real data


  return (
    <div className='ActivityPage'>
      <button>Add New Activity</button>
      {/* { add expanding add new list component here} */}
      {/* <ActivityContainer activityArray={activityArray} /> */}
    </div>
  );
};


export default ActivityPage;
