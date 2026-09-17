module.exports = function handler(request, response) {
  response.setHeader('Allow', 'POST');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
    return response.status(415).json({ error: 'Content-Type must be application/json' });
  }

  const score = request.body?.score;
  if (!Number.isSafeInteger(score) || score < 0 || score > 999) {
    return response.status(400).json({ error: 'Score must be an integer from 0 to 999' });
  }

  return response.status(200).json({ ok: true, score });
};
