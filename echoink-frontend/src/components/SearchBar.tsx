import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { postsState, Post } from "../store/store"; // import your atom
import { debounce } from "lodash"; // make sure you install lodash for debouncing
import { BASE_URL } from "../pages/Home";

export const SearchBar = () => {
  const [query, setQuery] = useState(""); // Search query state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_posts, setPosts] = useRecoilState<Post[]>(postsState); // Recoil state for posts

  // Fetch posts from backend
  const fetchPosts = async (searchQuery: string) => {
    try {
      const response = await fetch(`${BASE_URL}/posts?search=${searchQuery}`);
      const data = await response.json();
      console.log(data)
      setPosts(data.posts); // Update Recoil state with the fetched posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Debounced version of fetchPosts to avoid too many requests
  const debouncedFetchPosts = debounce(fetchPosts, 500); // 500ms debounce

  useEffect(() => {
    if (query) {
      debouncedFetchPosts(query); // Call debounced fetchPosts function
    } else {
      setPosts([]); // Optionally clear posts if query is empty
    }
  }, [query]);

  return (
<div className="w-full max-w-4xl mx-auto mt-4">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)} // Update query on input change
    placeholder="Search for posts..."
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


  );
};
