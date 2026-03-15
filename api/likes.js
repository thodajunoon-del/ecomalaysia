import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // For GET requests
  const body = req.body;    // For POST requests

  // Ensure an article ID is provided
  const articleId = id || body?.id;

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  try {
    if (method === 'GET') {
      // Fetch the current like count from Vercel KV
      // Retrieve as integer, default to 0 if not set
      let likes = await kv.get(`likes:${articleId}`);
      if (likes === null) {
          likes = 0;
      }
      return res.status(200).json({ id: articleId, likes: parseInt(likes) });
      
    } else if (method === 'POST') {
      // Update the like count
      const { action } = body;
      
      if (!['increment', 'decrement'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action. Must be increment or decrement.' });
      }

      let currentLikes = await kv.get(`likes:${articleId}`);
      if (currentLikes === null) {
          currentLikes = 0;
      }
      
      let newLikes = parseInt(currentLikes);

      if (action === 'increment') {
        newLikes++;
      } else if (action === 'decrement') {
        newLikes = Math.max(0, newLikes - 1); // Prevent negative likes
      }

      // Save the new count back to Vercel KV
      await kv.set(`likes:${articleId}`, newLikes);

      return res.status(200).json({ id: articleId, likes: newLikes });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error interacting with Vercel KV:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
