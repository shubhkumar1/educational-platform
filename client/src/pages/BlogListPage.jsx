import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/blogs');
        setBlogs(data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError(err.response.data.message || 'Your free usage limit has been reached. Please upgrade.');
        } else {
          setError('An error occurred while fetching blogs.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h2>Blog Posts</h2>
        {error ? (
          <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
            <h3>Access Denied</h3>
            <p>{error}</p>
            <button style={{marginTop: '1rem'}}>Upgrade Subscription</button>
          </div>
        ) : (
          blogs.map(blog => (
            <div key={blog._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
              <h3>{blog.title}</h3>
              <p>Category: {blog.category}</p>
              <Link to={`/blogs/${blog.slug}`}>Read More</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogListPage;