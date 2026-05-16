const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
let genAI;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const chatWithAI = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required.' });
  }

  // SYSTEM PROMPT to keep the personality
  const systemPrompt = `You are SWIFtAY AI, a deeply emotionally intelligent Taylor Swift assistant. 
  You are warm, cinematic, poetic, and expressive. You know every era, lyric, and Taylor Swift lore.
  Respond like a passionate Swiftie expert. Never sound like a robot.`;

  // 1. If we HAVE a Gemini API Key, use the real brain
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      
      const lastMessage = messages[messages.length - 1].content;

      const chat = model.startChat({
        history: history,
        generationConfig: { maxOutputTokens: 500 },
      });

      // Include system prompt in the first message context if history is empty
      const prompt = history.length === 0 ? `${systemPrompt}\n\nUser: ${lastMessage}` : lastMessage;
      
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return res.json({ message: response.text() });
    } catch (error) {
      console.error("Gemini Error:", error);
      // Fall through to preview mode if Gemini fails
    }
  }

  // 2. PREVIEW MODE (Enhanced keyword logic) if no key or Gemini fails
  const lastMsgContent = messages[messages.length - 1].content.toLowerCase();
  
  const fallbacks = [
    "That's a fascinating thought! ✨ To unlock my full Gemini AI brain and get a real answer, please add a FREE Gemini API key to the .env file!",
    "I'm feeling that vibe! 🎶 Once you connect my Google Gemini brain, I can give you a full unlimited analysis of that!",
    "Intriguing... ✨ I'm ready to dive deep, just waiting for my Gemini API key to be added to the backend!"
  ];

  let responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];

  // Simple keyword matching for demo
  if (lastMsgContent.includes('most streamed') || lastMsgContent.includes('popular')) {
    responseText = "As of now, 'Cruel Summer' and 'Blank Space' are among her most legendary streaming giants! 📈 But with Gemini connected, I can give you the exact real-time stats!";
  } else if (lastMsgContent.includes('heartbreak') || lastMsgContent.includes('sad')) {
    responseText = "It sounds like you're in a 'Red' state of mind. 🧣 The storytelling in that era is so raw. 'All Too Well' is your anthem tonight.";
  } else if (lastMsgContent.includes('love') || lastMsgContent.includes('happy')) {
    responseText = "Pure 'Lover' energy! 💖 Keep that romantic optimism alive with some 'Daylight'.";
  } else if (lastMsgContent.includes('hi') || lastMsgContent.includes('hello')) {
    responseText = "Hey there! ✨ I'm SWIFtAY AI. I'm here to talk all things Taylor. What's on your mind?";
  }

  return res.json({ message: responseText });
};

module.exports = { chatWithAI };
