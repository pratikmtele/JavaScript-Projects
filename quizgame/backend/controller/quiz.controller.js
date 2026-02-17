import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateQuiz = async (req, res) => {
  const { topic } = req.body;
  const difficulty = "medium";

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a quiz engine. Respond ONLY in valid JSON.",
        },
        {
          role: "user",
          content: `
            Generate 10 multiple choice question.

            Rules:
            - Topic: ${topic}
            - Difficulty: ${difficulty}
            - 4 options
            - 1 correct answer
            - Output strict JSON only 

            Format:
            {
                "question": "",
                "options": ["", "", "", ""],
                "correctAnswerIndex": 0
            }
        `,
        },
      ],
    });

    return res.status(200).json({
      data: JSON.parse(response.choices[0].message.content),
      message: "Successfully generated the quiz questions",
    });
  } catch (error) {
    console.log("Quix generation failed ", error);
    return res.status(400).json({ message: error.message });
  }
};

export { generateQuiz };
