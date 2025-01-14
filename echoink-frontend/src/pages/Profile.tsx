import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Post, userAtom } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Edit2, Image, Mail, User, Calendar, BookOpen} from "lucide-react";
import { toast } from "react-toastify";
import { BASE_URL } from "./Home";
import * as React from "react";
import { Dialog, DialogActions, DialogContentText,DialogTitle, DialogContent,TextField, Button } from "@mui/material";

const PostCard = React.lazy(() => import("../components/postCard"));

interface UserProfile {
  username: string;
  email?: string;
  image_link?: string;
  created_at: string;
  posts: Post[];
  _count: {
    posts: number;
  };
}

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'echoink_uploads';
const CLOUDINARY_CLOUD_NAME = 'ddrj7yzyl';
const CLOUDINARY_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Add this function to validate files
const validateFile = (file: File) => {
  if (file.size > CLOUDINARY_MAX_FILE_SIZE) {
    throw new Error('File size must be less than 10MB');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG and WebP images are allowed');
  }
  
  return true;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    new_username: "",
    email: "",
    image_link: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    image_link: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigateTo("/signin");
          return;
        }       

        setIsLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/getprofile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Profile Response:', data);

        if (data.success && data.user) {
          setProfile(data.user);
          setFormData({
            username: data.user.username || "",
            new_username: data.user.username || "",
            email: data.user.email || "",
            image_link: data.user.image_link || "",
          });
        } else {
          throw new Error(data.msg || "Failed to fetch profile");
        }
      } catch (error: any) {
        console.error('Profile Error:', error);
        setError(error.message || "Failed to fetch profile");
        toast.error(error.message || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchProfile();
    }
  }, [navigateTo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateFile(file);
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        toast.error(error.message);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_link;
      if (imageFile) {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        uploadFormData.append('folder', 'echoInk');
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: uploadFormData,
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to upload image');
        }
        
        const data = await response.json();
        imageUrl = data.secure_url;
      }

      // Update profile with new image URL
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/updateprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          new_username: formData.new_username,
          email: formData.email,
          image_link: imageUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Refresh profile data
        window.location.reload();
      } else {
        throw new Error(result.msg || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Post deleted successfully!");
        // Refresh profile data
        window.location.reload();
      } else {
        throw new Error(data.msg || "Failed to delete post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  // Update post handler
  const handleUpdatePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/updatepost/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Post updated successfully!");
        setIsEditDialogOpen(false);
        // Refresh profile data
        window.location.reload();
      } else {
        throw new Error(data.msg || "Failed to update post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load profile</h3>
          <p className="text-gray-500">{error}</p>
          <p className="text-gray-500 mt-2">Redirecting to signin...</p>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <User size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profile found</h3>
          <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
          <button
            onClick={() => navigateTo("/signin")}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="h-48 bg-gradient-to-r from-gray-900 to-gray-700 relative">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-auto md:translate-x-0 md:left-8">
          <div className="relative group">
            {isEditing ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg hover:border-gray-200 transition-all duration-200">
                  {previewUrl || profile.image_link ? (
                    <img
                      src={previewUrl || profile.image_link}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Image size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </label>
            ) : (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                {profile.image_link ? (
                  <img
                    src={profile.image_link}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Username
                    </label>
                    <input
                      type="text"
                      value={formData.new_username}
                      onChange={(e) =>
                        setFormData({ ...formData, new_username: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading || isUploading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Uploading image..." : loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profile.username}
                      </h1>
                      {profile.email && (
                        <div className="flex items-center mt-1 text-gray-500">
                          <Mail size={16} className="mr-2" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      <span>{profile._count.posts} posts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Activity Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{profile._count.posts}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.posts.reduce((acc, post) => acc + (post.tags?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500">Tags Used</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Posts</h2>
              {profile.posts.length > 0 ? (
                <div className="space-y-6">
                  {profile.posts.map((post) => {
                    const formattedPost = {
                      ...post,
                      User: {
                        ...post.User,
                        _count: {
                          posts: profile._count.posts
                        }
                      },
                      tags: post.tags || [],
                      is_edited: false,
                      last_edited: null,
                      image_link: post.image_link || null
                    };

                    return (
                      <React.Suspense
                        key={post.id}
                        fallback={
                          <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg"></div>
                        }
                      >
                        <div className="relative group">
                          <PostCard 
                            post={formattedPost} 
                            onDelete={handleDeletePost}
                            onEdit={(post) => {
                              setSelectedPost(post);
                              setEditFormData({
                                title: post.title,
                                description: post.description,
                                image_link: post.image_link || ""
                              });
                              setIsEditDialogOpen(true);
                            }}
                            showActions={true}
                          />
                        </div>
                      </React.Suspense>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Share your thoughts with the community
                  </p>
                  <button
                    onClick={() => navigateTo("/write")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Write your first post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (selectedPost) {
                handleDeletePost(selectedPost.id);
                setIsDeleteDialogOpen(false);
              }
            }} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedPost) {
              handleUpdatePost(selectedPost.id);
            }
          }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Image URL"
              type="url"
              fullWidth
              value={editFormData.image_link}
              onChange={(e) => setEditFormData({ ...editFormData, image_link: e.target.value })}
              variant="outlined"
            />
            <DialogActions>
              <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
