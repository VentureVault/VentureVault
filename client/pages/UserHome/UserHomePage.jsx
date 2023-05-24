import React, { useState, useContext, useEffect } from 'react';
import { userContext, categoryContext, pageContext } from '../../context';
import { useLoaderData, useNavigate } from 'react-router-dom';
// import TeamDisplay from './components/TeamDisplay';


const UserHomePage = () => {
  const loadedActivities = useLoaderData();
	const { user, setUser } = useContext(userContext);
  const {category, setCategory} = useContext(categoryContext);
  const { pageInfo } = useContext(pageContext);
	const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();
  
  // // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    if (pageInfo.current !== '/Activity') {
      pageInfo.current = 'JustLoadedUserHomePage';
    }
  }, [])

  useEffect(() => {
    // Make sure the category has been set and the user didn't just get to this page before navigating to activity page
    if (category !== null && pageInfo.current === '/UserHomePage') {
      return navigate(`/Activity/${user.username}/${category}`);
    }
  }, [category])


  const handleCreateCategory = async (e) => {
    e.preventDefault();
    //check to make sure they've entered info into the newCategor input element
    if (newCategory === '') {
      alert('Please enter a team name before submitting');
      return;
    }

    setCategory(newCategory);

    pageInfo.current = '/UserHomePage';
    return;
  };
  
  
  const makeCategoryButtons = (activityArray) => {

    let categorySet = new Set()

    for (const activityObj of activityArray) {
      categorySet.add(activityObj.categoryName)
    }
      
    const categoryArray = [];

    categorySet.forEach(category => categoryArray.push(category))

    return categoryArray.map(cat => {
      return (
        <button
          onClick={() => {
            pageInfo.current = '/UserHomePage';
            if (category === cat) {
              return navigate(`/Activity/${user.username}/${category}`)
            } else {
              setCategory(cat);
            }
          }}
        >
          {cat}
        </button>
      );
    });
  };
  
	
	return (
		<>
			<div className='user-home-page'>
				<h1>User Home Page</h1>
				<div id='create-new-category-div' className=' '>
					<input
						type='text'
						placeholder='Enter your new category here'
						onChange={(e) => setNewCategory(e.target.value)}
					/>
					<button onClick={handleCreateCategory}>Create New Category</button>
				</div>
			</div>
			<div id='category-container-div' className=''>
				<h2>Your Categories</h2>
        {JSON.stringify(filterCategory(loadedActivities))}
        <br />
        {makeCategoryButtons(loadedActivities)}
			</div>
		</>
	);
};

export default UserHomePage;


function filterCategory(activityArray) {
  let categorySet = new Set()

  for (const activityObj of activityArray) {
    categorySet.add(activityObj.categoryName)
  }
  
  const result = [];

  categorySet.forEach(category => result.push(category))

  return result
}
