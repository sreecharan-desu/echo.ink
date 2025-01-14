import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, Chip, Avatar, Button } from "@mui/material";
import { AccessTime as AccessTimeIcon, CalendarToday as CalendarIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { formatDistanceToNow as formatDistance } from "date-fns/formatDistanceToNow";
import { useState } from "react";
const DOMPurify = require('dompurify');

interface PostData {
  id: string;
  created_at: string;
  description: string;
  image_link: string | null;
  is_edited: boolean;
  last_edited: string | null;
  title: string;
  tags: string[];
  User: {
    _count: {
      posts: number;
    };
    created_at: string;
    email: string;
    id: string;
    image_link: string | null;
    username: string;
  };
}

interface BlogPostCardProps {
  post: PostData;
  onDelete?: (postId: string) => void;
  onEdit?: (post: PostData) => void;
  showActions?: boolean;
}

const BlogPostCard = ({ post, onDelete, onEdit, showActions = false }: BlogPostCardProps) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Calculate read time (assuming 200 words per minute reading speed)
  const readTime = Math.max(1, Math.ceil(post.description.split(/\s+/).length / 200));

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/author/${post.User.id}`);
  };

  const sanitizedDescription = () => {
    try {
      const decodedDescription = decodeURIComponent(post.description.replace(/\+/g, ' '));
      return DOMPurify(window).sanitize(decodedDescription, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'br'],
        ALLOWED_ATTR: ['href', 'target']
      });
    } catch (error) {
      console.error("Description sanitization error:", error);
      return post.description;
    }
  };

  const handleActionClick = (
    event: React.MouseEvent,
    action: (param: any) => void,
    param: any
  ) => {
    event.stopPropagation();
    action(param);
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
        position: "relative",
      }}
      onClick={handlePostClick}
    >
      <Box sx={{ position: "relative", height: 200 }}>
        <img
          src={!imageError && post.image_link ? post.image_link : "/vite.svg"}
          alt={post.title}
          onError={() => setImageError(true)}
          style={{
            width: "100%",
            height: "100%",
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
              color: "primary.main",
            },
          }}
        >
          {post.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Avatar
            src={post.User.image_link || undefined}
            alt={post.User.username}
            sx={{ width: 40, height: 40, cursor: "pointer" }}
            onClick={handleUsernameClick}
          >
            {post.User.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ 
                fontWeight: 600, 
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                }
              }}
              onClick={handleUsernameClick}
            >
              {post.User.username}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDistance(new Date(post.created_at), { addSuffix: true })}
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
          dangerouslySetInnerHTML={{ __html: sanitizedDescription() }}
        />

        {post.is_edited && post.last_edited && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EditIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Last edited {formatDate(post.last_edited)}
            </Typography>
          </Box>
        )}

        {showActions && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
              opacity: 0,
              transition: "opacity 0.2s",
              ".MuiCard-root:hover &": {
                opacity: 1,
              },
              zIndex: 1,
            }}
          >
            {onEdit && (
              <Button
                variant="contained"
                size="small"
                onClick={(e) => handleActionClick(e, onEdit, post)}
                sx={{ minWidth: "auto", p: 1 }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={(e) => handleActionClick(e, onDelete, post.id)}
                sx={{ minWidth: "auto", p: 1 }}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;