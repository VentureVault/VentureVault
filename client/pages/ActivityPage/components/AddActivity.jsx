import React, { useState, useContext, useMemo } from 'react';
import { userContext } from '../../../context';

const AddActivity = ({ category, setActivityArray, expanded, setExpanded }) => {
  const { user } = useContext(userContext);
  const [activityName, setActivityName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [url, setUrl] = useState('');
  const [validUrl, setValidUrl] = useState(true);
  const [urls, setUrls] = useState([]);
  const convertedUrls = useMemo(() => convertUrls(urls), [urls])

  const addUrl = () => {
    const urlRegex = /http[s]{0,1}:\/\//i;
    if (urlRegex.test(url)) {
      setValidUrl(true);
      setUrls([...urls, url]);
      setUrl('');
    } else {
      setValidUrl(false);
    }
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
    };

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
      alert('Failed to add item');
    }
  }

  return (
    <main className='new-activity-page'>

      <div className='addActivityContainer'>
        <div className='entryDiv'>
          <span className='bucketlistEntry'>What do you want to add to this list?</span>
          <input className='bucketlistText' type="text" value={activityName} placeholder='Enter new list item here' name="activityName" onChange={(e) => {setActivityName(e.target.value)}}/>
        </div>

        <div className='entryDiv'>
            <span className='bucketlistEntry'>Location</span>
            <input className='bucketlistText' type="text" value={locationName} placeholder='Optional: Enter location here' name="activityName" onChange={(e) => {setLocationName(e.target.value)}}/>
        </div>

        <div className='urlDiv'>
          <span className='urlEntry'>Add helpful links: </span>
            {convertedUrls}
          <div className='urlInput'>
            <input className='bucketlistText' type="text" value={url} placeholder='Optional: Enter full url here' name="url" onChange={(e) => {setUrl(e.target.value)}}/>
            <button className='addUrlButton' onClick={addUrl}>+</button>
          </div>
          {!validUrl && <div className='urlEntry'>URLs must start with http:// or https://</div>}
        </div>
        
        <div className="trip-button">
          <button onClick={addItem}>Add Item!</button>
        </div>
      </div>

    </main>
  );
}

export default AddActivity


function convertUrls(urls) {
  if (urls.length === 0) return;

  return (
    <div className='entryDiv'>
      {urls.map(url => (
        <div className='bucketlistEntry'>
          <a href={url} target="_blank" >
            {url}
          </a>
        </div>
      ))}
    </div>
  );
}