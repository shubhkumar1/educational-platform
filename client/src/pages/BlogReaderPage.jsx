import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../prose-styles.css';

// Parser for rendering HTML content with custom components
import parse, { domToReact } from 'html-react-parser';
import StaticCodeBlock from '../components/StaticCodeBlock';

const BlogReaderPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/blogs/${slug}`);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);
  
  const parseOptions = {
    replace: domNode => {
      if (domNode.name === 'pre' && domNode.children[0]?.name === 'code') {
        const codeText = domNode.children[0].children[0]?.data || '';
        return <StaticCodeBlock codeString={codeText} />;
      }
    }
  };

  // FIX: Add a helper function to format the name correctly
  const toTitleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!blog) {
    return <div className="flex justify-center items-center h-screen">Blog not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Main article container with responsive padding */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
            <button onClick={() => window.close()} className="btn-secondary">
                ← Close Preview
            </button>
        </div>

        <article className="bg-white rounded-lg shadow-md p-3 sm:p-6 md:p-8 lg:p-12">
            <header className="mb-8">
                {/* Category in Teal */}
                <p className="text-teal-600 font-semibold uppercase tracking-wide">{blog.category}</p>
                
                {/* Responsive Title */}
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    {blog.title}
                </h1>
                
                {/* Byline */}
                <div className="mt-4 text-sm text-gray-500">
                    <span>By <span className="font-semibold capitalize">{toTitleCase(blog.author?.name) || 'Unknown Author'}</span></span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            {/* Optional Cover Image */}
            {/* {blog.coverImage && (
                <img src={blog.coverImage} alt={blog.title} className="w-full rounded-lg mb-8" />
            )} */}
            <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 my-0" />
            {/* This div uses the ProseMirror class to apply our shared styles */}
            <div className="ProseMirror">
                {parse(blog.content, parseOptions)}
            </div>
        </article>
      </main>
    </div>
  );
};

export default BlogReaderPage;