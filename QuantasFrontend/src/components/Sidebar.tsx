import React, { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { api } from '../api/client';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
    const { posts, setPosts, setCurrentPost, currentPost, removePost } = useEditorStore();

    useEffect(() => {
        api.getPosts().then(setPosts);
    }, [setPosts]);

    const handleCreatePost = async () => {
        const newPost = await api.createPost();
        setPosts([...posts, newPost]);
        setCurrentPost(newPost);
    };

    const handleDeletePost = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this post?")) {
            await api.deletePost(id);
            removePost(id);
        }
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } p-4 flex flex-col shrink-0`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-800">Smart Editor</h1>
                <button onClick={onToggle} className="lg:hidden text-gray-500 hover:text-gray-700">
                    <span className="text-2xl">&times;</span>
                </button>
            </div>
            <button
                onClick={() => {
                    handleCreatePost();
                    if (window.innerWidth < 1024) onToggle();
                }}
                className="mb-4 bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 transition"
            >
                + New Post
            </button>
            <div className="flex-1 overflow-y-auto">
                {posts.map(post => (
                    <div
                        key={post.id}
                        onClick={() => {
                            setCurrentPost(post);
                            if (window.innerWidth < 1024) onToggle();
                        }}
                        className={`p-3 cursor-pointer rounded-md mb-2 transition flex items-center justify-between group ${currentPost?.id === post.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{post.title || 'Untitled'}</div>
                            <div className="text-xs text-gray-500">{post.status}</div>
                        </div>
                        <button
                            onClick={(e) => handleDeletePost(e, post.id)}
                            className="ml-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Delete Post"
                        >
                            <span className="text-lg">&times;</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
