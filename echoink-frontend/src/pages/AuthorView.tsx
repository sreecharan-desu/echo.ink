import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Box, Chip, Typography, Skeleton } from "@mui/material";
import PostCard from "../components/postCard"; // Your component to display individual posts
import { BASE_URL } from "./Home";
import { Post } from "../store/store";

// Define the types for Author and Post

type Author = {
    id: string;
    username: string;
    created_at: string;
    bio?: string;
    image_link?: string;
    _count: {
        posts: number;
    };
    posts: Post[];
};

// API function to fetch author details
const getAuthorDetails = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/author/${userId}`);
    const data = await response.json();
    return data;
};

export const AuthorView = () => {
    const { authorId } = useParams<{ authorId: string }>();
    const [author, setAuthor] = useState<Author | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch author details and their posts
        const fetchAuthorData = async () => {
            try {
                const { user } = await getAuthorDetails(authorId); // Fetch from the API
                setAuthor(user);
                setPosts(user.posts); // Extract posts from the response
            } catch (error) {
                console.error("Error fetching author data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, [authorId]);

    if (loading) {
        return (
            <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3 }}>
                {/* Author Profile Skeleton */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                    <Skeleton variant="circular" width={120} height={120} />
                    <Box sx={{ width: "60%" }}>
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <Skeleton variant="rectangular" width={100} height={30} />
                            <Skeleton variant="rectangular" width={140} height={30} />
                        </Box>
                    </Box>
                </Box>

                {/* Posts Skeleton */}
                <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width="100%" height={250} />
                    ))}
                </Box>
            </Box>
        );
    }

    if (!author) {
        return <Typography>Author not found</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3 }}>
            {/* Author Profile Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                <Avatar
                    src={author.image_link || "/default-avatar.png"}
                    alt={author.username}
                    sx={{ width: 120, height: 120 }}
                />
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {author.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {author.posts.length > 0 ? (
                            // Extract tags from posts
                            (() => {
                                const allTags = author.posts
                                    .map((post) => post.tags)
                                    .flat()
                                    .filter((tag) => tag); // Flatten and filter out empty tags

                                if (allTags.length === 0) {
                                    return "This author hasn't added any tags to their posts yet. Write about tags to improve discoverability!";
                                }

                                // Pick 3 random tags to display
                                const randomTags = allTags
                                    .sort(() => 0.5 - Math.random()) // Shuffle tags
                                    .slice(0, 3); // Get the first 3 random tags

                                return `This author actively writes about topics such as ${randomTags.join(", ")}.`;
                            })()
                        ) : (
                            "No posts available. Write some posts and add tags to make them more discoverable!"
                        )}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Chip label={`Posts: ${author._count.posts}`} />
                        <Chip label={`Joined: ${new Date(author.created_at).toLocaleDateString()}`} />
                    </Box>
                </Box>
            </Box>

            {/* Author's Posts */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Posts by {author.username}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
                {posts.length > 0 ? (
                    posts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <Typography>No posts available</Typography>
                )}
            </Box>
        </Box>
    );
};
