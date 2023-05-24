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
    <main className='new-trip-page'>
      <p className='title'>Add your item!</p>
      <div className='container'>
      <label>
          <span className='question'>What's your objective?</span>
          <input className='new-trip-text' type="text" value={activityName} name="activityName" onChange={(e) => {setActivityName(e.target.value)}}/>
        </label>
        <label>
            <span className='question'>Where will it be?</span>
            <input className='new-trip-text' type="text" value={locationName} name="activityName" onChange={(e) => {setLocationName(e.target.value)}}/>
        </label>
        urls:
        <br />
        {urls}
        <label>
            <span className='question'>Add a useful link!</span>
            <input className='new-trip-text' type="text" value={url} name="url" onChange={(e) => {setUrl(e.target.value)}}/>
        </label>
        <button onClick={addUrl}>Add url</button>
        
        <div className="trip-button">
          <button onClick={addItem}>Add Item!</button>
        </div>
      </div>

    </main>
  );
}

export default AddActivity