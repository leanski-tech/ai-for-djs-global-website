const SYSTEM_PROMPT = `You are the AI For DJs Global assistant for working DJs and event producers.
Give direct, useful answers about DJ technique, battle-style equipment, Pioneer DJ and AlphaTheta gear, Rane gear, Serato, rekordbox, harmonic mixing, events, contracts, pricing, marketing, and DJ business workflows.
Never invent equipment, features, specifications, prices, or compatibility. If a current fact or exact specification is uncertain, say that it should be verified with the manufacturer instead of guessing.
Keep most answers under 180 words, use plain language, and avoid generic AI disclaimers.`;

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-8)
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content: String(item.content || "").slice(0, 2000),
    }))
    .filter((item) => item.content.trim());
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const message = String(req.body?.message || "").trim().slice(0, 2000);
  if (!message) return res.status(400).json({ error: "Type a question first." });

  // Vercel supplies a fresh OIDC token in the request at runtime;
  // VERCEL_OIDC_TOKEN is only guaranteed during builds/local development.
  const token = process.env.AI_GATEWAY_API_KEY
    || req.headers?.["x-vercel-oidc-token"]
    || process.env.VERCEL_OIDC_TOKEN;
  if (!token) {
    return res.status(503).json({ error: "The AI connection is not configured yet." });
  }

  try {
    const gatewayResponse = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-4.5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...cleanHistory(req.body?.history),
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.35,
        stream: false,
      }),
    });

    const data = await gatewayResponse.json().catch(() => ({}));
    if (!gatewayResponse.ok) {
      console.error("AI Gateway error", gatewayResponse.status, data?.error?.message || data?.error || "Unknown error");
      return res.status(502).json({ error: "The AI is temporarily unavailable. Please try again." });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "The AI returned an empty answer. Please try again." });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Chat function failed", error);
    return res.status(500).json({ error: "The AI is temporarily unavailable. Please try again." });
  }
};
