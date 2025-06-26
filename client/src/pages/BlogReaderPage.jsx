import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BlogReaderPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/blogs/${id}`);
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div>
      <Navbar userRole="student" />
      <div style={{ padding: '1rem' }}>
        <Link to="/blogs">Back to Blogs</Link>
        <hr />
        <h1>{blog.title}</h1>
        <p>By {blog.author} in <strong>{blog.category}</strong></p>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  );
};

export default BlogReaderPage;