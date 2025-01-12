import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { postsState, Post } from "../store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Image, Pen, User2Icon } from "lucide-react";

export const Homepage = () => {
    const [posts, setPosts] = useRecoilState<Post[]>(postsState);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        const fetchPosts = async () => {
            const res = await fetch(
                "https://echoink-backend.cloudflare-apis.workers.dev/getbulk"
            );
            const data = await res.json();
            if (data.success) {
                toast.success("Fetched posts successfully");
                setPosts(data.posts);
                setLoading(false)
            } else {
                toast.error(data.msg);
                setLoading(false)
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
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
                <div className="grid gap-6">
                    {posts.map((post: Post) => (
                       <div
                       key={post.id}
                       className={`${
                           loading
                               ? "bg-gray-400 animate-pulse p-10"
                               : "bg-white border border-gray-200 rounded-lg shadow-sm p-10"
                       }`}
                   >
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                           {/* Left Section */}
                           <div className={`flex-1`}>
                               {loading ? (
                                   <>
                                       <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
                                       <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                                       <div className="h-5 bg-gray-300 rounded w-full mb-6"></div>
                                   </>
                               ) : (
                                   <>
                                       <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                                       <p className="text-sm text-gray-500 mb-4">{convertDate(post.created_at)}</p>
                                       <p className="text-gray-700 mb-6">{post.description}</p>
                                   </>
                               )}
                   
                               <div className="flex items-center space-x-4">
                                   {/* User Image */}
                                   {loading ? (
                                       <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                   ) : (
                                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                           {post.User.image_link ? (
                                               <img
                                                   src={post.User.image_link}
                                                   alt="User"
                                                   className="w-full h-full object-cover"
                                               />
                                           ) : (
                                               <User2Icon className="text-gray-400" size={24} />
                                           )}
                                       </div>
                                   )}
                   
                                   {/* User Info */}
                                   {loading ? (
                                       <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                   ) : (
                                       <div>
                                           <p className="text-lg font-medium text-gray-800">
                                               {post.User.username}
                                           </p>
                                       </div>
                                   )}
                               </div>
                   
                               {post.is_edited && !loading && (
                                   <div className="flex items-center text-sm text-gray-500 mt-4">
                                       <Pen size={16} />
                                       <span className="ml-2">
                                           Last edited: {convertDate(post.last_edited)}
                                       </span>
                                   </div>
                               )}
                           </div>
                   
                           {/* Right Section */}
                           <div className="mt-4 sm:mt-0 sm:ml-6">
                               {loading ? (
                                   <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
                               ) : post.image_link ? (
                                   <img
                                       src={post.image_link}
                                       alt="Post"
                                       className="w-32 h-32 rounded-lg object-cover border border-gray-200 shadow-sm"
                                   />
                               ) : (
                                   <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg">
                                       <Image className="text-gray-400" size={36} />
                                   </div>
                               )}
                           </div>
                       </div>
                   </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
