import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { AccessTime as AccessTimeIcon, CalendarToday as CalendarIcon, Edit as EditIcon } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PostData {
  id: string;
  created_at: string;
  description: string;
  image_link: string;
  is_edited: boolean;
  last_edited: string;
  title: string;
  tags: string[];
  User: {
    _count: {
      posts: number;
    };
    created_at: string;
    email: string;
    id: string;
    image_link: string;
    username: string;
  };
}

interface BlogPostCardProps {
  post: PostData;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate read time
  const readTime = Math.ceil(post.description.split(" ").length / 200);

  // Calculate the time ago
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  // Navigate to post details
  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  // Navigate to user profile
  const handleUsernameClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to post
    navigate(`/author/${post.User.id}`);
  };

  return (
    <Card
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[6],
        },
        cursor: "pointer",
      }}
      onClick={handlePostClick} // Navigate to post on card click
    >
      {!imageError && post.image_link ? (
        <Box sx={{ position: "relative" }}>
          <img
            src={post.image_link}
            alt={post.title}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            label={`${readTime} min read`}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>
      ) : (
        <Box sx={{ position: "relative" }}>
          <img
            src={`/vite.svg`}
            alt={post.title}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
            label={`${readTime} min read`}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            "&:hover": {
              color: "black",
            },
          }}
        >
          {post.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Avatar
            src={post.User.image_link}
            alt={post.User.username}
            sx={{ width: 40, height: 40, cursor: "pointer" }}
            onClick={handleUsernameClick} // Navigate to user profile on avatar click
          >
            {post.User.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, cursor: "pointer" }}
              onClick={handleUsernameClick} // Navigate to user profile on username click
            >
              {post.User.username}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {timeAgo}
                </Typography>
              </Box>
              <Chip
                label={`${post.User._count.posts} posts`}
                size="small"
                variant="outlined"
                sx={{ height: 20 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                bgcolor: "grey.100",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            />
          ))}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.description}
        </Typography>

        {post.is_edited && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EditIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Last edited {formatDate(post.last_edited)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
