import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TiptapEditor from '../components/TiptapEditor';
import PublishWarning from '../components/PublishWarning';
import { UploadCloud } from 'lucide-react';

const FORBIDDEN_KEYWORDS = ['copyright', 'ban id', 'hack', 'piracy', 'illegal'];

const EditBlogPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [newCoverImage, setNewCoverImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [existingCoverImageUrl, setExistingCoverImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isWarningModalOpen, setWarningModalOpen] = useState(false);
    const [flaggedKeywords, setFlaggedKeywords] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/blogs/${id}/edit`);
                setTitle(data.title);
                setCategory(data.category);
                setContent(data.content);
                setExistingCoverImageUrl(data.coverImage || '');
            } catch (error) {
                alert("Could not load blog post data.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setNewCoverImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }, []);

    useEffect(() => {
        // Cleanup the object URL to prevent memory leaks
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const handleConfirmUpdate = async () => {
        setWarningModalOpen(false);
        setIsUploading(true);

        // This object will hold all the data to be sent to the backend
        const updateData = { title, category, content };

        // --- ADDED: Real ImgBB Upload Logic for Updates ---
        if (newCoverImage) {
            try {
                const formData = new FormData();
                formData.append('image', newCoverImage);

                const response = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                    formData,
                    { withCredentials: false } // Important for third-party API calls
                );
                
                // If upload is successful, add the new image URL to our update data
                updateData.coverImage = response.data.data.url;
                console.log('New cover image uploaded to ImgBB:', updateData.coverImage);

            } catch (error) {
                setIsUploading(false);
                alert('New cover image upload failed. The post will be updated without changing the image.');
                console.error("ImgBB upload failed:", error);
            }
        }
        try {
            // The 'updateData' object will contain the new coverImage URL only if the upload was successful
            await axios.put(`http://localhost:8080/api/blogs/${id}`, updateData);
            alert('Blog post updated successfully!');
            navigate('/creator/dashboard');
        } catch (error) {
            alert('Error updating blog post.');
        } finally {
            setIsUploading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullContent = (title + ' ' + content).toLowerCase();
        const foundKeywords = FORBIDDEN_KEYWORDS.filter(keyword => fullContent.includes(keyword));

        if (foundKeywords.length > 0) {
            setFlaggedKeywords(foundKeywords);
            setWarningModalOpen(true);
        } else {
            handleConfirmUpdate();
        }
    };
    
    const noteStyle = "text-xs text-red-600 mt-1";
    const labelStyle = "block text-sm font-semibold text-gray-800";
    const inputStyle = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3";

    if (loading) return <div>Loading Editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                 <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                    <header className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Blog Post</h1>
                        <p className="mt-1 text-gray-500">Make changes to your existing article below.</p>
                    </header>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className={labelStyle}>Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                        </div>

                        <div>
                            <label htmlFor="category" className={labelStyle}>Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={inputStyle}>
                                <option>Technology</option>
                                <option>Science</option>
                                <option>Finance</option>
                                <option>Arts</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className={labelStyle}>Update Cover Image (Optional)</label>
                            {!preview && existingCoverImageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700">Current Image:</p>
                                    <img src={existingCoverImageUrl} alt="Current cover" className="mt-2 rounded-md max-h-48" />
                                </div>
                            )}
                             <div {...getRootProps()} className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 cursor-pointer hover:border-blue-500">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {isDragActive ? "Drop the new image here..." : "Drag 'n' drop a new image here, or click to select"}
                                    </p>
                                    {newCoverImage && <p className="mt-2 text-xs font-semibold text-teal-600">New image selected: {newCoverImage.name}</p>}
                                </div>
                                <input {...getInputProps()} className="sr-only" />
                            </div>
                            {preview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700">New Image Preview:</p>
                                    <img src={preview} alt="New cover preview" className="mt-2 rounded-md max-h-48" />
                                </div>
                            )}
                            <p className={noteStyle}>* Note: For the cover image, please use a 16:9 aspect ratio (e.g., 1280x720 pixels).</p>
                        </div>

                        <div>
                            <label className={labelStyle}>Content</label>
                            <span className="text-xs text-red-600">* For images inside the post, a width of 800px is recommended (e.g., 800x450 pixels).</span>
                            <div className="mt-1 border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                <TiptapEditor
                                    content={content}
                                    onUpdate={(newContent) => setContent(newContent)}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500" disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Update Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <PublishWarning
                isOpen={isWarningModalOpen}
                onClose={() => setWarningModalOpen(false)}
                onConfirm={handleConfirmUpdate}
                flaggedKeywords={flaggedKeywords}
            />
        </div>
    );
};

export default EditBlogPage;