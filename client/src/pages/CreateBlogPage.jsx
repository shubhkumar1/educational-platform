import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// A simple toolbar for the Tiptap editor
const TiptapToolbar = ({ editor }) => {
    if (!editor) return null;
    return (
        <div className="toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
            <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        </div>
    );
};

const CreateBlogPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [coverImage, setCoverImage] = useState(null); // Will hold the uploaded file

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start writing your amazing blog post here...</p>',
    });

    const onDrop = useCallback(acceptedFiles => {
        // We'll just take the first file
        setCoverImage(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = editor.getHTML();

        // --- SIMULATED IMAGE UPLOAD ---
        // As per the prototype, we would upload to Imgur here. [cite: 17]
        // For now, we'll just log it and use a placeholder URL.
        let imageUrl = 'https://via.placeholder.com/800x400';
        if (coverImage) {
            console.log('Uploading image to Imgur:', coverImage.name);
            // const formData = new FormData();
            // formData.append('image', coverImage);
            // const imgurResponse = await axios.post('https://api.imgur.com/3/image', formData, { headers: { 'Authorization': 'Client-ID YOUR_IMGUR_CLIENT_ID' } });
            // imageUrl = imgurResponse.data.data.link;
        }

        try {
            await axios.post('http://localhost:8080/api/blogs', {
                title,
                category,
                content,
                coverImage: imageUrl,
                status: 'published' // Or 'draft'
            });
            alert('Blog post created successfully!');
            navigate('/creator/dashboard'); // Redirect after success
        } catch (error) {
            console.error('Failed to create blog post:', error);
            alert('Error creating blog post.');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h2>Create New Blog Post</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                            <option>Technology</option>
                            <option>Science</option>
                            <option>Finance</option>
                            <option>Arts</option>
                        </select>
                    </div>
                    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '1rem' }}>
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop the image here ...</p> : <p>Drag 'n' drop a cover image here, or click to select</p>}
                        {coverImage && <p>Selected: {coverImage.name}</p>}
                    </div>
                    <div style={{ border: '1px solid #ccc' }}>
                        <TiptapToolbar editor={editor} />
                        <EditorContent editor={editor} style={{ padding: '1rem', minHeight: '200px' }} />
                    </div>
                    <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Publish Post</button>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPage;