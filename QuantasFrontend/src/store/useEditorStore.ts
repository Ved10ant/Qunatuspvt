import { create } from 'zustand';

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  updated_at: string;
}

interface EditorState {
  currentPost: Post | null;
  posts: Post[];
  isSaving: boolean;
  lastSaved: string | null;
  setCurrentPost: (post: Post | null) => void;
  setPosts: (posts: Post[]) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSaved: (lastSaved: string | null) => void;
  updatePostContent: (content: string) => void;
  updatePostTitle: (title: string) => void;
  removePost: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentPost: null,
  posts: [],
  isSaving: false,
  lastSaved: null,
  setCurrentPost: (post) => set({ currentPost: post }),
  setPosts: (posts) => set({ posts }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  updatePostContent: (content) => 
    set((state) => ({
      currentPost: state.currentPost ? { ...state.currentPost, content } : null,
      posts: state.posts.map(p => 
        p.id === state.currentPost?.id ? { ...p, content } : p
      )
    })),
  updatePostTitle: (title) => 
    set((state) => ({
      currentPost: state.currentPost ? { ...state.currentPost, title } : null,
      posts: state.posts.map(p => 
        p.id === state.currentPost?.id ? { ...p, title } : p
      )
    })),
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      currentPost: state.currentPost?.id === id ? null : state.currentPost,
    })),
}));
