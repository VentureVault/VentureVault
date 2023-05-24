
export const ActivitiesLoader = async ({ params }) => {
  const { username } = params
  console.log('in Loader, username:', username)
  try {
    const response = await fetch('/api/activity/get-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    });
    if (response.status === 200) {
      const activities = await response.json();
      console.log(activities);
      return activities
    } else {
      return [{ fail: 'fail'}]
      console.log('fail')
    }
  } catch (err) {
      return null
  }
}

export const CategoryLoader = async ({ params }) => {
  const { username, categoryName } = params
  console.log('in Loader, username and categoryName:', username, categoryName)
  try {
    const response = await fetch('/api/activity/get-by-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        category_name: categoryName
      })
    });
    if (response.status === 200) {
      const activities = await response.json();
      console.log(activities);
      return activities
    } else {
      return [{ fail: 'fail' }]
      console.log('fail')
    }
  } catch (err) {
    return null
  }
};
