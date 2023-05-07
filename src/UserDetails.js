import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./UserDetails.css"
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <>
          <div>
            <div className="name-handle d-flex pt-5 px-5 align-items-center">
              <img className="avatar" width='15%' height='20%' src={user.avatar_url} alt={user.login} />
              <div className='mx-3'>
                <div className="name">{user.name}</div>
                <div className="handle">@{user.login}</div>
              </div>
            </div>
            <div className="details mx-5 mt-2">
              <div className="details-heading">Bio</div>
              <div className='details-description'>{user.bio}</div>
              <br />

              <div className="details-heading">Works at</div>
              <div className='details-description'> {user.company}</div>
              <br />

              <div className='d-flex justify-content-between'>
                <div>
                  <div className="details-heading">Repositories</div>
                  <div className='details-description'>{user.public_repos}</div>
                </div>
                <div>
                  <div className="details-heading">Followers</div>
                  <div className="details-description">{user.followers}</div>
                </div>
              </div>
              <br />

              <div className='details-heading'>Pinned Repositories</div>
              <div className='repo-grid'>
                {userData.map((repo) => (
                  <div key={repo.id} className="card card-shadow d-flex flex-row">
                    <img className='repo-img mt-3 mx-3' src={repo.owner.avatar_url} alt={repo.owner.login} />
                    <div className="card-body">
                      <h5 className="card-title">{repo.owner.login}/{repo.name}</h5>
                      <p className="card-text bio">{repo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetails;
