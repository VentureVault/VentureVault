import React from 'react';

// activity_name given from backend
// const mockActivityObject = {
//   activityName: 'Hike the PCT',
//   locationName: 'West coast',
//   category: 'Activity',
//   urlArray: ['https://www.pcta.org/']
// };

// const ActivityContainer = (props) => {
const ActivityContainer = ({activityArray}) => {
  // array of activity divs
  const activities = [];
  // create containers for each activity
  for (let i = 0; i < activityArray.length; i++) {
    // grab necessary data to add to Activity component
    // const { 
    //   activity_id: id,
    //   activity_name: activityName, // string
    //   location_name: locationName, // string
    //   detail_urls: urls, // array
    // } = activityArray; // change to activity object when db is set up
    const { 
      activityId,
      activityName, // string
      locationName, // string
      urls, // array
    } = activityArray; // change to activity object when db is set up
    activities.push(
      <Activity 
        key={activityID}
        activityName={activityName}
        locationName={locationName}
        urls={urls}
      />
    )
  };
  return(
    <div className='activityContainer'>
      {activities}
    </div>
  )
};