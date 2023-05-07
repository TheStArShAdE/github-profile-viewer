import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./UserDetails.css"

const UserDetails = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      const userResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=3`);
      const userData = await userResponse.json();
      setUser(data);
      setUserData(userData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <div className="name-handle">
            <p className="name">{user.name}</p>
            <p className="handle">@{user.login}</p>
            <img className="avatar" width='15%' height='20%' src={user.avatar_url} alt={user.login} />
          </div>
          <div className="details">
            <p className="bio">Bio<br/> {user.bio}</p>
            <br/>
            <p className="company">Works at<br/> {user.company}</p>
            <br/>
            <p className="repo">Repositories<br/> {user.public_repos}</p>
            <p className="followers">Followers<br/> {user.followers}</p>
            <br/>
            <p style={{color: "rgb(100, 100, 100)"}}>Pinned Repositories<br/><br/></p>
            <div className='repo-grid'>
              {userData.map((repo) => (
              <div key={repo.id} className="repo-tile">
                <p>{repo.owner.login}/{repo.name}</p>
                <p>{repo.description}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetails;
