import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
// Vercel auto-populates KV_REST_API_URL and KV_REST_API_TOKEN when a KV DB is linked
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

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
      // Fetch the current like count from Redis
      let likes = await redis.get(`likes:${articleId}`);
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

      let currentLikes = await redis.get(`likes:${articleId}`);
      if (currentLikes === null) {
          currentLikes = 0;
      }
      
      let newLikes = parseInt(currentLikes);

      if (action === 'increment') {
        newLikes++;
      } else if (action === 'decrement') {
        newLikes = Math.max(0, newLikes - 1); // Prevent negative likes
      }

      // Save the new count back to Redis
      await redis.set(`likes:${articleId}`, newLikes);

      return res.status(200).json({ id: articleId, likes: newLikes });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error interacting with Redis:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
