const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Post = require('../models/Post');

// AI Client Setup
const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY || '');

// Post Routes
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { returnDocument: 'after' }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts/:id/publish', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'published', updated_at: new Date() },
      { returnDocument: 'after' }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Routes
router.post('/ai/generate', async (req, res) => {
  const { content } = req.body;
  if (!process.env.GENAI_API_KEY) {
    return res.json({ summary: "AI summary feature requires a valid Gemini API Key. (Simulated response)" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following blog post content in 3 sentences: ${content}`;
    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
