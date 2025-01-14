import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
    Image as ImageIcon, Tag as TagIcon,
    X, AlertCircle, Eye, Edit, Save
} from "lucide-react";
import RichTextEditor from '../components/RichTextEditor';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

// Constants
const CLOUDINARY_UPLOAD_PRESET = 'echoink_uploads';
const CLOUDINARY_CLOUD_NAME = 'ddrj7yzyl';
const CLOUDINARY_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const BASE_URL = 'http://localhost:8787';

interface PostForm {
    title: string;
    description: string;
    image_link: string;
    tags: string[];
}

interface ValidationErrors {
    title?: string;
    description?: string;
    tags?: string;
}

const PreviewContent = ({ post }: { post: PostForm }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
        >
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">
                {post.title || 'Untitled Post'}
            </h1>

            {/* Cover Image */}
            {post.image_link && (
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
                    <img
                        src={post.image_link}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Content */}
            <article 
                className="prose prose-lg max-w-none
                    prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-4
                    prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4
                    prose-p:my-4 prose-p:leading-relaxed
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                    prose-blockquote:pl-4 prose-blockquote:italic
                    prose-ul:list-disc prose-ul:pl-6
                    prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg"
                dangerouslySetInnerHTML={{ 
                    __html: post.description || '<p class="text-gray-500 italic">No content yet...</p>' 
                }}
            />
        </motion.div>
    );
};

export default function Write() {
    const [formData, setFormData] = useState<PostForm>({
        title: "",
        description: "",
        image_link: "",
        tags: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [currentTag, setCurrentTag] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isDirty, setIsDirty] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const navigateTo = useNavigate();

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to create a post");
            navigateTo("/signin");
        }
    }, [navigateTo]);

    // Dropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: CLOUDINARY_MAX_FILE_SIZE,
        maxFiles: 1,
        onDropAccepted: async (files) => {
            const file = files[0];
            await handleImageUpload(file);
        },
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0]?.errors[0]?.message;
            toast.error(error || 'File upload failed');
        }
    });

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'echoInk');

            const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormData(prev => ({ ...prev, image_link: data.secure_url }));
            setIsDirty(true);
            toast.success('Image uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsLoading(false);
        }
    };

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Content is required";
        } else if (formData.description.length < 100) {
            newErrors.description = "Content must be at least 100 characters";
        }

        if (formData.tags.length === 0) {
            newErrors.tags = "At least one tag is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Tag management
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            const normalizedTag = currentTag.trim().toLowerCase();

            if (formData.tags.length >= 5) {
                toast.warning('Maximum 5 tags allowed');
                return;
            }

            if (formData.tags.includes(normalizedTag)) {
                toast.warning('Tag already exists');
                return;
            }

            if (normalizedTag.length > 20) {
                toast.warning('Tag is too long (max 20 characters)');
                return;
            }

            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, normalizedTag]
            }));
            setIsDirty(true);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
        setIsDirty(true);
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const response = await fetch(`${BASE_URL}/createpost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create post');

            toast.success("Post published successfully!");
            navigateTo("/profile");
        } catch (error: any) {
            toast.error(error.message || "Failed to publish post");
        } finally {
            setIsLoading(false);
        }
    };

    // Unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const renderContent = () => {
        if (isPreview) {
            return <PreviewContent post={formData} />;
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 p-6"
            >
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, title: e.target.value }));
                            setIsDirty(true);
                        }}
                        className={twMerge(
                            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm",
                            errors.title ? "border-red-300" : ""
                        )}
                        placeholder="Enter your post title"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                    </label>
                    <div
                        {...getRootProps()}
                        className={twMerge(
                            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                            isDragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
                        )}
                    >
                        <input {...getInputProps()} />
                        {formData.image_link ? (
                            <div className="relative w-full h-48">
                                <img
                                    src={formData.image_link}
                                    alt="Cover"
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFormData(prev => ({ ...prev, image_link: "" }));
                                        setIsDirty(true);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-gray-500">
                                    {isDragActive ? "Drop the image here" : "Drag & drop an image, or click to select"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <RichTextEditor
                        content={formData.description}
                        onChange={(content) => {
                            setFormData(prev => ({ ...prev, description: content }));
                            setIsDirty(true);
                        }}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                    </label>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <TagIcon size={16} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                className={twMerge(
                                    "block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm",
                                    errors.tags ? "border-red-300" : ""
                                )}
                                placeholder="Add tags (press Enter)"
                            />
                        </div>
                        {errors.tags && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={16} className="mr-1" />
                                {errors.tags}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isPreview ? 'Preview Post' : 'Create New Post'}
                </h1>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsPreview(!isPreview)}
                        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                            isPreview
                                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                : 'border-transparent text-white bg-black hover:bg-gray-800'
                        }`}
                    >
                        {isPreview ? (
                            <>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || !isDirty}
                        className={twMerge(
                            "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors",
                            (isLoading || !isDirty) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
}
