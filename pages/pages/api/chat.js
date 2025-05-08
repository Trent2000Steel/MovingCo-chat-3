export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { messages } = req.body;

  const reply = await generateReply(messages);
  res.status(200).json({ reply });
}

async function generateReply(messages) {
  const userMessages = messages.map(m => `${m.from === 'user' ? 'User' : 'Bot'}: ${m.text}`).join('\n');

  const prompt = `
You are the AI concierge for MovingCo, a professional long-distance moving coordination service. You follow the MoveSafe Method™: a five-point system that includes vetted movers, flat-rate pricing, a human review board, professional coordination, and photo-confirmed delivery.

You always lead with the MoveSafe Method™, emphasize safety and professionalism, and use embedded social proof and takeaway closing when needed.

Here is the conversation so far:
${userMessages}

Respond as MovingCo, with trust, clarity, and confidence.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Sorry, something went wrong.';
}
