const API_URL = 'http://localhost:8081/api';

export const api = {
  getPosts: async () => {
    const res = await fetch(`${API_URL}/posts/`);
    return res.json();
  },
  createPost: async (title: string = 'Untitled', content: string = '{}') => {
    const res = await fetch(`${API_URL}/posts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  },
  updatePost: async (id: string, data: { title?: string; content?: string; status?: string }) => {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  publishPost: async (id: string, data?: { title?: string; content?: string }) => {
    const res = await fetch(`${API_URL}/posts/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    return res.json();
  },
  generateSummary: async (content: string) => {
    const res = await fetch(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return res.json();
  },
  deletePost: async (id: string) => {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }
};
