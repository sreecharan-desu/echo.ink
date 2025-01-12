import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { postsState, Post } from "../store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Image, Pen, User2Icon } from "lucide-react";

export const Homepage = () => {
    const [posts, setPosts] = useRecoilState<Post[]>(postsState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    "https://echoink-backend.cloudflare-apis.workers.dev/getbulk"
                );
                const data = await res.json();

                if (data.success) {
                    toast.success("Fetched posts successfully");
                    setPosts(data.posts);
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
    }, []);

    const convertDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
        };
        //@ts-expect-error -> this is an invalid error
        return new Intl.DateTimeFormat("en-IN", options).format(date);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>

            <div className="grid gap-6">
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-400 animate-pulse border border-gray-200 rounded-lg shadow-sm p-10"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                                    <div className="h-5 bg-gray-300 rounded w-full mb-6"></div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 sm:ml-6">
                                    <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))
                    : posts.map((post: Post) => (
                        <div
                            key={post.id}
                            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-300 rounded-lg shadow-lg p-10 transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:scale-105"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                        {post.title}
                                        {post.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-white py-1 px-3 ml-2 text-sm font-medium rounded-full shadow-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {convertDate(post.created_at)}
                                    </p>
                                    <p className="text-gray-700 mb-6 leading-relaxed">{post.description}</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-md transition duration-300 ease-in-out hover:ring-2 hover:ring-gray-400">
                                            {post.User.image_link ? (
                                                <img
                                                    src={post.User.image_link}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User2Icon className="text-gray-400" size={28} />
                                            )}
                                        </div>
                                        <p className="text-lg font-medium text-gray-800">{post.User.username}</p>
                                    </div>
                                    {post.is_edited && (
                                        <div className="flex items-center text-sm text-gray-500 mt-4">
                                            <Pen size={16} />
                                            <span className="ml-2">
                                                Last edited: {convertDate(post.last_edited)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 sm:mt-0 sm:ml-8">
                                    {post.image_link ? (
                                        <img
                                            src={post.image_link}
                                            alt="Post"
                                            className="w-64 h-64 rounded-lg object-cover border border-gray-200 shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-gray-300"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                                            <Image className="text-gray-400" size={48} />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    ))}
            </div>
        </div>
    );
};
