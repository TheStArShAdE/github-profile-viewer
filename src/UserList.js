import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const UserList = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null)

  // Access token gets revoked after every commit hence the fetch call to API would result in 402 : Bad Authorization error
  const accessToken = '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';

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleScroll = (event) => {
    const scrollContainer = event.target;
    if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight && !loading) {
      loadMoreUsers();
    }
  };

  useEffect(() => {
  }, [query])

  const loadMoreUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.github.com/search/users?q=${query}&page=${page + 1}&per_page=8`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const data = await response.json();
      const user = await data.items.map(async (each) => {
        const userResponse = await fetch(each.url, {
          headers: {
            Authorization: `token ${accessToken}`
          }
        });
        const userData = await userResponse.json();
        each.userDetails = userData
        return each
      })
      const resolvedUser = await Promise.all(user);
      console.log(data);
      setUsers(prevUsers => [...prevUsers, ...resolvedUser]);
      setPage(prevPage => prevPage + 1);
      setLoading(false);
    } catch (error) {
      console.error('Error loading more users:', error);
      setLoading(false);
    };
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://api.github.com/search/users?q=${query}&per_page=8`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });
      const data = await response.json();
      const user = await data.items.map(async (each) => {
        const userResponse = await fetch(each.url, {
          headers: {
            Authorization: `token ${accessToken}`
          }
        });
        const userData = await userResponse.json();
        each.userDetails = userData
        return each
      })
      const resolvedUser = await Promise.all(user);
      setPage(1);
      setUsers(resolvedUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-user">
      <div className="search-box">
        <p className="title"><FontAwesomeIcon icon={faGithub} /> GitHub Profile Viewer</p>
        <form className="searchbar" onSubmit={handleSearch}>
          <button className="magnifying-glass" type="submit"><FontAwesomeIcon icon={faSearch} /></button>
          <input className="search" style={{ border: 'none', outline: 'none' }} type="text" onChange={handleInputChange} placeholder="Search user" required />
          <button className="cross" type="reset"><FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff", }} /></button>
        </form>
      </div>
      <br /><br />
      <div ref={scrollContainerRef} onScroll={handleScroll} style={{ height: '400px', overflowY: 'scroll' }} className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-tile mx-auto">
            <Link to={`/user/${user.login}`} style={{ textDecoration: "none", color: "black" }}>
              <div className="card card-shadow d-flex flex-row" style={{ width: '25rem' }}>
                <img className='mt-3 mx-3' src={user.avatar_url} alt={user.login} />
                <div className="card-body">
                  <h5 className="card-title">{user.userDetails.name}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">@{user.login}{user.userDetails.company ? ', works at '+ user.userDetails.company : ''}</h6>
                  <p className="card-text bio">{user.userDetails.bio}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
