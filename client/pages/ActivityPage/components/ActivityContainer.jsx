import React from 'react';
// import components
import Activity from './Activity';
import AddActivity from './AddActivity';
// activity_name given from backend
// const mockActivityObject = {
//   activityName: 'Hike the PCT',
//   locationName: 'West coast',
//   category: 'Activity',
//   urlArray: ['https://www.pcta.org/']
// };

const ActivityContainer = ({activityArray}) => {
  // array of activity divs
  const activities = [];
  // create containers for each activity
  activityArray.forEach(activity => {
    // grab necessary data to add to Activity component
    const { 
      activityId, // string
      activityName, // string
      locationName, // string
      urls // array
    } = activity; 
  
    activities.push(
      <Activity 
        key={activityId}
        activityName={activityName}
        locationName={locationName}
        urls={urls}
      />
    );
  });

  return(
    <div id='activityContainer'>
      {activities}
    </div>
  );
};
  


export default ActivityContainer;