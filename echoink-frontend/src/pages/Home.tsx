import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { postsState, Post, InsighthspostsState } from "../store/store";
import { toast } from "react-toastify";import * as React from "react";
const PostCard = React.lazy(() => import("../components/postCard"));
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Skeleton,
  Divider,
} from "@mui/material";
import {
  LocalOffer as TagIcon,
  TrendingUp as TrendingIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Featured Categories Component
const FeaturedCategories = ({ posts, onCategoryClick, selectedCategory }: {
  posts: Post[],
  onCategoryClick: (category: string) => void,
  selectedCategory: string | null
}) => {
  const categories = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).slice(0, 4);

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TagIcon sx={{ mr: 1, color: "black" }} />
        <Typography variant="h6">Featured Categories</Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => onCategoryClick(category)}
            sx={{
              border : 1,
              bgcolor: selectedCategory === category ? "black" : "transparent",
              color: selectedCategory === category ? "white" : "black",
              "&:hover": {
                bgcolor: selectedCategory === category ? "black" : "lightgrey",
                color: selectedCategory === category ? "white" : "black",
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};
export const BASE_URL = 'https://echoink-backend.cloudflare-apis.workers.dev';
// Latest Insights Component
const LatestInsights = ({ posts }: { posts: Post[] }) => {
  // Get top contributors based on post count
  const contributors = Object.values(
    posts.reduce((acc: { [key: string]: { username: string; count: number } }, post) => {
      const username = post.User.username;
      if (!acc[username]) {
        acc[username] = { username, count: 0 };
      }
      acc[username].count++;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count).slice(0, 3);

  // Get tag distribution
  const tagStats = posts.flatMap(post => post.tags)
    .reduce((acc: { [key: string]: number }, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const totalTags = Object.values(tagStats).reduce((a, b) => a + b, 0);
  const topTags = Object.entries(tagStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TrendingIcon sx={{ mr: 1, color: "black" }} />
        <Typography variant="h6">Latest Insights</Typography>
      </Box>

      {/* Community Stats */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <GroupIcon sx={{ mr: 1, fontSize: 20, color: "black" }} />
          <Typography variant="subtitle1">Top Contributors</Typography>
        </Box>
        <Box sx={{ pl: 1 }}>
          {contributors.map((contributor, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                my: 1
              }}
            >
              <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                {contributor.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="body2">
                {contributor.username}
              </Typography>
              <Chip
                label={`${contributor.count} posts`}
                size="small"
                sx={{ ml: 'auto' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tag Distribution */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Popular Topics
        </Typography>
        {topTags.map(([tag, count]) => (
          <Box key={tag} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="black">
                #{tag}
              </Typography>
              <Typography variant="body2" color="black">
                {Math.round((count / totalTags) * 100)}%
              </Typography>
            </Box>
            <Box sx={{ height: 6, width: "100%", backgroundColor: "#f1f1f1", borderRadius: 1 }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${(count / totalTags) * 100}%`,
                  backgroundColor: "#1976d2",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Main Homepage Component
export default function Homepage(){
  const [posts, setPosts] = useRecoilState<Post[]>(postsState);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [insights, setInsightsPosts] = useRecoilState<Post[]>(InsighthspostsState)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/getbulk`
        );
        const data = await res.json();

        if (data.success) {
          setPosts(data.posts);
          setInsightsPosts(data.posts)
          toast.success("Posts loaded successfully");
        } else {
          toast.error(data.msg);
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        {/* Skeleton for Featured Categories */}
        <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />

        {/* Skeleton for Post Cards */}
        <Grid container spacing={3}>
          {[...Array(6)].map((_, idx) => (
            <Grid item xs={12} key={idx}>
              <Skeleton variant="rectangular" height={250} />
            </Grid>
          ))}
        </Grid>

        {/* Skeleton for Latest Insights */}
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={180} />
      </Box>
    );
  }
  const filteredPosts = selectedCategory ? (posts ? posts : insights).filter(post => post.tags.includes(selectedCategory)) : posts;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <FeaturedCategories
        posts={posts}
        onCategoryClick={(category) => {
          setSelectedCategory(selectedCategory === category ? null : category);
        }}
        selectedCategory={selectedCategory}
      />

      <Grid container spacing={4}>
        {/* Main Posts Section */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <PostCard post={{...post, is_edited: false, last_edited: null}} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                  <h2>No posts found</h2>
                  <p>Try adjusting your search or check back later for new posts.</p>
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <LatestInsights posts={insights} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
