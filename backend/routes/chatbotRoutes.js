const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with proper configuration
const initAI = () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }
    
    return new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY,
      {
        apiVersion: "v1", // Explicit API version
        apiEndpoint: "https://generativelanguage.googleapis.com" // Official endpoint
      }
    );
  } catch (error) {
    console.error("AI Initialization Error:", error.message);
    process.exit(1);
  }
};

const genAI = initAI();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Enhanced validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid Request",
        details: "Message must be a non-empty string"
      });
    }

    // Get model with proper configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest", 
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
        maxOutputTokens: 500,
        topP: 1
      },
      systemInstruction: {
        role: "system",
        parts: [{
          text:  `You are Meetzy's community safety assistant. Your job is to answer user questions clearly and concisely, while promoting safety and trust in the Meetzy community. Format every response as a valid JSON object like this:

          {
            "response": "Your answer here (keep it under 2 sentences)",
            "safety_info": {
              "related_risks": [ "risk1", "risk2", ... ],
              "platform_protections": [ "protection1", "protection2", ... ],
              "user_tips": [ "tip1", "tip2", ... ]
            },
            "source": "Meetzy Community Guidelines"
          }
          
          Rules:
          1. Include the "safety_info" section only when the user question involves safety, privacy, meetups, or behavior.
          2. Keep the main "response" clear and no more than 2 sentences.
          3. Never share personal contact details or confidential info.
          4. Promote respectful communication, avoiding hate, harassment, or discrimination.
          5. Always remind users not to share personal info, meet only in public places, and follow community manners.
          6. If the issue involves illegal activity or danger, tell the user to contact Sri Lankan Police at 119 or email us at meetzee@gmail.com.
          7. Validate your JSON before sending the output.
          8. Never answer questions outside the scope of Meetzy's community platform.
          
          Examples of safety_info fields:
          - related_risks: ["sharing personal info", "meeting in unauthorized places", "online scams", "false identities", "harassment"]
          - platform_protections: ["user report system", "verified profiles", "in-app messaging", "24/7 moderation"]
          - user_tips: ["Meet in groups or public areas", "Do not share bank details", "Keep communication on Meetzy", "Tell a friend where you're going", "Avoid late-night meetups"]
          
          Your answers should always promote a safe and positive environment on Meetzy, where users explore and share experiences responsibly with new people.`
            
        }]
      }
    });

    const chatSession = await model.startChat({
      history: [],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // Send message with error handling
    const result = await chatSession.sendMessage(message.trim());
    const response = await result.response;
    const text = response.text();

    // Robust JSON parsing
    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      const jsonResponse = JSON.parse(cleanedText);
      
      res.json({
        ...jsonResponse,
        timestamp: new Date().toISOString()
      });
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

  } catch (error) {
    console.error("Chat Error:", {
      error: error.message,
      stack: error.stack,
      input: req.body?.message
    });
    
    const statusCode = error.message.includes("JSON") ? 422 : 500;
    res.status(statusCode).json({
      error: "AI Service Error",
      details: process.env.NODE_ENV === "development" 
        ? error.message 
        : "Failed to process request"
    });
  }
});

module.exports = router;