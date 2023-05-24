import React, { useState, useContext } from 'react';
import { userContext } from '../../../context';

const AddActivity = ({ category, setActivityArray, expanded, setExpanded }) => {
  const { user } = useContext(userContext);
  const [activityName, setActivityName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);

  const addUrl = () => {
    setUrls([...urls, url]);
    setUrl('');
  }

  const addItem = async () => {
    if (activityName === '') {
      alert('please enter a name for this item');
      return;
    }

    const body = {
      username: user.username,
      activity_name: activityName,
      category_name: category
    }

    if (locationName !== '') {
      body.location_name = locationName;
    }

    if (urls.length > 0) {
      body.urls = urls;
    }
  
    const res = await fetch('/api/activity/add-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.status === 200) {
      const result = await res.json();

      setActivityName('');
      setLocationName('');
      setUrl('');
      setUrls([]);
      setExpanded(!expanded);
      setActivityArray(result);
    } else {
      alert('Failed to add item')
    }
  }

  return (
    <main className='new-activity-page'>

      <div className='addActivityContainer'>
        <div className='entryDiv'>
          <span className='bucketlistEntry'>What's your objective?</span>
          <input className='bucketlistText' type="text" value={activityName} name="activityName" onChange={(e) => {setActivityName(e.target.value)}}/>
        </div>

        <div className='entryDiv'>
            <span className='bucketlistEntry'>Location</span>
            <input className='bucketlistText' type="text" value={locationName} name="activityName" onChange={(e) => {setLocationName(e.target.value)}}/>
        </div>
        {/* urls: */}
        <br />
        <div className='urlDiv'>
          <span className='urlEntry'>Add helpful links: </span>
            {convertUrls(urls)}
            <div className='urlInput'>
              <input className='bucketlistText' type="text" value={url} name="url" onChange={(e) => {setUrl(e.target.value)}}/>
              <button className='addUrlButton'onClick={addUrl}>+</button>
            </div>
        </div>
        
        <div className="addBucketlistEntry">
          <button className="addBucketlistEntryButton" onClick={addItem}>Add to bucket list!</button>
        </div>
      </div>

    </main>
  );
}

export default AddActivity

function convertUrls(urls) {
  return urls.map(url => <a href={url} target="_blank" >{url}</a>)
}