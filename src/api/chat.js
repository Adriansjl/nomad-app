export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, useSearch } = req.body;

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system,
    messages,
  };

  if (useSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }

  try {
    const res2 = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.REACT_APP_ANTHROPIC_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res2.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}