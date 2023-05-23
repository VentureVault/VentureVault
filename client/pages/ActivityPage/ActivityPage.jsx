import React, { useState } from 'react';

import ActivityContainer from './components/ActivityContainer'

const mockActivityObject1 = {
  activityName: 'Hike the PCT',
  activityId: 1,
  locationName: 'West coast',
  category: 'Activity',
  urls: ['https://www.pcta.org/']
};
const mockActivityObject2 = {
  activityName: 'Climb half dome',
  activityId: 2,
  locationName: 'Yosemite NP',
  category: 'Activity',
  urls: ['https://www.nps.gov/yose/planyourvisit/halfdome.htm']
}
const mockActivityArray = [mockActivityObject1, mockActivityObject2];

const ActivityPage = () => {

  const [activityArray, setActivityArray] = useState(mockActivityArray); // *** change for real data
  const [expanded, setExpanded] = useState(false);

  return (
    <div id='ActivityPage'>
      <button onClick={() => setExpanded(!expanded)}>Add New Activity</button>
      {expanded && <AddActivity />}
      <ActivityContainer activityArray={activityArray} />
    </div>
  );
};


export default ActivityPage;
