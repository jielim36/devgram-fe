import PostItem from "@/components/PostItem/PostItem";
import { Post } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
            "https://i.pinimg.com/564x/f9/7f/09/f97f09c15d4184d0f9d700dccbd57db5.jpg",
            "https://static.wixstatic.com/media/c7e19c_9bb8a7187f384d5d875e83e5a74b104e~mv2.jpg/v1/fill/w_924,h_882,al_c,q_85,enc_auto/c7e19c_9bb8a7187f384d5d875e83e5a74b104e~mv2.jpg",
            "https://i.pinimg.com/564x/be/9b/19/be9b199cf38cdc54c1f797850835b8e2.jpg",
            "https://i.pinimg.com/564x/a2/69/06/a26906e91bee2f22dbcd24b76f3ef5e2.jpg"
        ],
        comments: [
            {
                user: {
                    id: 1,
                    username: "Lim Yee Jie",
                    avatar_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "hahahahahah what is that?",
                created_at: "2023-07-01T00:00:00Z",
                updated_at: "2024-06-01T00:00:00Z",
            },
            {
                user: {
                    id: 2,
                    username: "Kaiyang",
                    avatar_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "fjlsdkfjlasdfjlds fdsf dfsdfds fdsfsdfds dfsdf sdfkdsljfdskjfl fdskfjsdfsdlfk dsflkjldfjsd  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl ?",
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
            {
                user: {
                    id: 2,
                    username: "Jetsonn_",
                    avatar_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "fjlsdkfjlasdfjlds fdsf dfsdfds fdsfsdfds dfsdf sdfkdsljfdskjfl fdskfjsdfsdlfk dsflkjldfjsd  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl ?",
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
            {
                user: {
                    id: 2,
                    username: "Tong__",
                    avatar_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "fjlsdkfjlasdfjlds fdsf dfsdfds fdsfsdfds dfsdf sdfkdsljfdskjfl fdskfjsdfsdlfk dsflkjldfjsd   dsflkjldfjsd  dsflkjldfjsd   dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd  dsflkjldfjsd sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl  sdfkdsljfdskjfl ?",
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
        ],
        created_at: "2024-05-01T00:00:00Z",
        updated_at: "2021-07-01T00:00:00Z"
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
            "https://i.pinimg.com/564x/06/04/23/060423aa8608e12c76c5f653cf6bc1fc.jpg",
            "https://i.pinimg.com/564x/15/c6/97/15c697690ad7cc3e3aa61d55b6265ddb.jpg",
            "https://i.pinimg.com/736x/72/df/bb/72dfbb8d686ce65928271ae4d9ee9270.jpg",
        ],
        comments: [
            {
                user: {
                    id: 1,
                    username: "Lim Yee Jie",
                    avatar_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/1e/46/31/1e4631abacd902b7db344e909de41b6b.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "hahahahahah what is that?",
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
            {
                user: {
                    id: 2,
                    username: "Kaiyang",
                    avatar_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                    is_active: true,
                    stories: [
                        {
                            id: 1,
                            image_url: "https://i.pinimg.com/564x/9b/b0/66/9bb066864b0d225c324551ee2c83125d.jpg",
                            created_at: "2021-07-01T00:00:00Z",
                        }
                    ],
                    created_at: "2021-07-01T00:00:00Z",
                    updated_at: "2021-07-01T00:00:00Z",
                },
                comment: "fjlsdkfjlasdfjlds fdsf dfsdfds fdsfsdfds dfsdf sdfkdsljfdskjfl fdskfjsdfsdlfk dsflkjldfjsd?",
                created_at: "2021-07-01T00:00:00Z",
                updated_at: "2021-07-01T00:00:00Z",
            },
        ],
        created_at: "2021-07-01T00:00:00Z",
        updated_at: "2021-07-01T00:00:00Z"
    },
];

const Home = () => {

    return (
        <>
            <div className="relative w-[340px] sm:w-[530px] left-2/4 -translate-x-2/4 lg:-translate-x-3/4 pb-24">
                {/* Post Listing */}
                <div className="flex flex-col gap-16">
                    {posts.map((post) => (
                        <PostItem key={post.id} user={post.user} post={post} />
                    ))}
                </div>
            </div>
        </>
    );

}

export default Home;