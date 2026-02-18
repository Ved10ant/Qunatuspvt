import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIControls from './components/AIControls';
import { useEditorStore } from './store/useEditorStore';
import { api } from './api/client';

function App() {
  const { currentPost, setPosts, posts } = useEditorStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePublish = async () => {
    if (!currentPost) return;
    try {
      // Send current state to ensure unsaved title/content changes are not lost
      const updatedPost = await api.publishPost(currentPost.id, {
        title: currentPost.title,
        content: currentPost.content
      });
      // Update local state
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      useEditorStore.getState().setCurrentPost(updatedPost);
      alert("Post published!");
    } catch (e) {
      alert("Failed to publish");
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {currentPost && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 hidden sm:inline">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${currentPost.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {currentPost.status.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {currentPost && (
            <button
              onClick={handlePublish}
              disabled={currentPost.status === 'published'}
              className={`bg-black text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-medium transition ${currentPost.status === 'published' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
            >
              {currentPost.status === 'published' ? 'Published' : 'Publish'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto pt-4 bg-gray-50/30">
          {currentPost ? (
            <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
              <AIControls />
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8">
                <Editor />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Post Selected</h3>
              <p className="mt-1">Select a post from the sidebar or create a new one to start editing.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;