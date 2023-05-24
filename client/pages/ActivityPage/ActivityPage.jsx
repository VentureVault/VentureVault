import React, { useContext, useEffect, useState } from 'react';

import ActivityContainer from './components/ActivityContainer';
import AddActivity from './components/AddActivity';
import { useLoaderData } from 'react-router-dom';
import { categoryContext, pageContext } from '../../context';

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
  const activitiesFromCategory = useLoaderData();
  const [activityArray, setActivityArray] = useState(mockActivityArray); // *** change for real data
  const [expanded, setExpanded] = useState(false);
  const { category } = useContext(categoryContext);
  const { pageInfo } = useContext(pageContext);

  useEffect(() => {
    pageInfo.current = '/Activity';
  }, []);


  return (
    <div id='ActivityPage'>
      <button id='addActivityButton' onClick={() => setExpanded(!expanded)}>Add New Activity</button>
      {expanded && <AddActivity category={category} setActivityArray={setActivityArray} expanded={expanded} setExpanded={setExpanded} />}
      <ActivityContainer activityArray={activityArray} />
      <ActivityContainer activityArray={activitiesFromCategory} />
    </div>
  );
};


export default ActivityPage;
