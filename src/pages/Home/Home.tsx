import PostItem from "@/components/PostItem/PostItem";
import { Post } from "@/types";

const posts: Post[] = [
    {
        id: 1,
        user: {
            id: 1,
            username: "Lim Yee Jie",
            avatar_url: "https://randomuser.me/api/port",
            is_active: true,
            created_at: "2021-07-01T00:00:00Z",
            updated_at: "2021-07-01T00:00:00Z",
        },
        description: "This is a post",
        images: [
            "https://www.searchenginejournal.com/wp-content/uploads/2023/07/ig-post-64c0fd5992930-sej.png",
            "https://static.wixstatic.com/media/c7e19c_9bb8a7187f384d5d875e83e5a74b104e~mv2.jpg/v1/fill/w_924,h_882,al_c,q_85,enc_auto/c7e19c_9bb8a7187f384d5d875e83e5a74b104e~mv2.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwli79UXcuAzVah3IsKm4odDDcK9bZ03fvIg&s",
            "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMDY1OTc2fHxlbnwwfHx8fHw%3D",
        ],
    },
    {
        id: 2,
        user: {
            id: 1,
            username: "John Doe",
            avatar_url: "https://randomuser.me/api/port",
            is_active: true,
            created_at: "2021-07-01T00:00:00Z",
            updated_at: "2021-07-01T00:00:00Z",
        },
        description: "This is a post",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR843AApQMthsajHdX3kXrcfbTuUs7CV1YeRQ&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oAa216dhvSkp1YJ0djbJl6AL8oWF5vB9aA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkoQ7a8RHWRwj8hrha4KJERrAAPW3RmSvtTw&s",
        ],
    },
];

const Home = () => {

    return (
        <div className="absolute w-[340px] sm:w-[500px] left-2/4 -translate-x-2/4">
            {/* Post Listing */}
            <div className="flex flex-col gap-16">
                {posts.map((post) => (
                    <PostItem key={post.id} user={post.user} post={post} />
                ))}
            </div>
        </div>
    );

}

export default Home;