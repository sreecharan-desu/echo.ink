import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton, Grid, Skeleton } from "@mui/material";
import { AccessTime as AccessTimeIcon, CalendarToday as CalendarIcon, ContentCopy as ContentCopyIcon, Facebook, Twitter, WhatsApp } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton, FacebookIcon, WhatsappIcon, TwitterIcon } from "react-share";
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "./Home";
import { Post } from "../store/store";
import { toast } from "react-toastify";
import { Copy, Share, Share2 } from "lucide-react";

// Medium-sized button style
const buttonStyles = {
  borderRadius: "50%",
  padding: "12px",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
};

const iconStyles = {
  fontSize: 32,
};

const SinglePostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${postId}`);
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readTime = post ? Math.ceil(post.description.split(" ").length / 200) : 0;
  const timeAgo = post ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : "";
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (!post) return (
    <Card elevation={3} sx={{ maxWidth: 700, margin: "auto", marginTop: 3, display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden", bgcolor: "background.paper", boxShadow: 2 }}>
      <CardContent sx={{ padding: 3 }}>
        <Skeleton variant="text" sx={{ mb: 2, width: "80%" }} />
        <Skeleton variant="text" sx={{ mb: 1, width: "60%" }} />
        <Skeleton variant="text" sx={{ mb: 3, width: "40%" }} />
        <Skeleton variant="rectangular" sx={{ height: 200, mb: 3 }} />
        <Skeleton variant="text" sx={{ mb: 2 }} />
        <Skeleton variant="text" sx={{ mb: 2, width: "30%" }} />
      </CardContent>
    </Card>
  );

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 700, // Reduced width for better readability
        margin: "auto",
        marginTop: 3,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      {/* Content Section */}
      <CardContent sx={{ padding: 3 }}>
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            mb: 2,
            lineHeight: 1.4,
            color: "text.primary",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </Typography>

        {/* Author and Date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar
            src={post.User.image_link}
            alt={post.User.username}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {post.User.username} <b className="font-extrabold">&middot;</b> <span className="bg-gray-200 px-2 py-0.5 text-xs font-bold rounded-xl">{post.User._count.posts} posts</span> <b className="font-extrabold">&middot;</b> <span className="bg-gray-200 px-2 py-0.5 text-xs font-bold rounded-xl">Member since {formatDate(post.User.created_at)}</span> 
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {timeAgo}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                bgcolor: "grey.200",
                "&:hover": {
                  bgcolor: "grey.300",
                },
                borderRadius: "20px",
              }}
            />
          ))}
        </Box>

        {/* Image Section */}
        {!imageError && post.image_link ? (
          <Box sx={{ position: "relative", mb: 3 }}>
            <img
              src={post.image_link}
              alt={post.title}
              onError={() => setImageError(true)}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
              label={`${readTime} min read`}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
              }}
            />
          </Box>
        ) : (
          <Box sx={{ position: "relative", mb: 3 }}>
            <img
              src={`/vite.svg`}
              alt={post.title}
              onError={() => setImageError(true)}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
              label={`${readTime} min read`}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
              }}
            />
          </Box>
        )}

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            display: "-webkit-box",
            WebkitLineClamp: 6,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "1rem",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap", // To maintain formatting with new lines
            textOverflow: "ellipsis", // Adds ellipsis if content overflows
          }}
        >
          <span className="indent-5">{post.description}</span>
        </Typography>

        <span>{post.is_edited ?               <span className="bg-gray-100 px-2 py-0.5 font-thin rounded-xl italic text-sm">lastly edited on {formatDate(post.last_edited)} at {formatTime(post.last_edited)}</span>  : <></>}</span>
        <div className="flex justify-between items-center gap-6 p-4 border-t border-t-gray-300 bg-white shadow-md">
  {/* Share Buttons */}
  <div className="flex gap-6">
    {/* Facebook Share */}
    <FacebookShareButton url={window.location.href} className="transition-transform duration-300 hover:scale-110">
      <Facebook className="text-blue-600 text-2xl" />
    </FacebookShareButton>

    {/* WhatsApp Share */}
    <WhatsappShareButton url={window.location.href} className="transition-transform duration-300 hover:scale-110">
      <WhatsApp className="text-green-600 text-2xl" />
    </WhatsappShareButton>

    {/* Twitter Share */}
    <TwitterShareButton url={window.location.href} className="transition-transform duration-300 hover:scale-110">
      <Twitter className="text-blue-400" />
    </TwitterShareButton>
  </div>

  {/* Copy Link Button */}
  <button
    onClick={handleCopyLink}
    className="p-3 bg-blue-600 text-white rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-110"
  >
    <Share2  className="text-xl" />
  </button>
</div>

      </CardContent>
    </Card>
  );
};

export default SinglePostView;
