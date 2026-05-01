import { GoogleGenAI, Type } from "@google/genai";
import { isMockMode } from "../lib/firebase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'translate' | 'match';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  audioText?: string;
}

const MOCK_QUESTIONS: Record<string, QuizQuestion[]> = {
  spanish: [
    { id: 's1', type: 'multiple-choice', question: 'How do you say "Hello" in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Por favor'], answer: 'Hola' },
    { id: 's2', type: 'translate', question: 'Translate: "Good morning"', answer: 'Buenos días' },
    { id: 's3', type: 'multiple-choice', question: 'Which word means "Thank you"?', options: ['De nada', 'Lo siento', 'Gracias', 'Hola'], answer: 'Gracias' },
  ],
  french: [
    { id: 'f1', type: 'multiple-choice', question: 'How do you say "Hello" in French?', options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'], answer: 'Bonjour' },
    { id: 'f2', type: 'translate', question: 'Translate: "Good evening"', answer: 'Bonsoir' },
    { id: 'f3', type: 'multiple-choice', question: 'Which word means "Thank you"?', options: ['Pardon', 'Désolé', 'Merci', 'Salut'], answer: 'Merci' },
  ],
  japanese: [
    { id: 'j1', type: 'multiple-choice', question: 'How do you say "Hello" in Japanese?', options: ['Konnichiwa', 'Sayonara', 'Arigato', 'Sumimasen'], answer: 'Konnichiwa' },
    { id: 'j2', type: 'translate', question: 'Translate: "Good morning"', answer: 'Ohayou gozaimasu' },
    { id: 'j3', type: 'multiple-choice', question: 'Which word means "Thank you"?', options: ['Hai', 'Iie', 'Arigato', 'Sumimasen'], answer: 'Arigato' },
  ],
  korean: [
    { id: 'k1', type: 'multiple-choice', question: 'How do you say "Hello" in Korean?', options: ['Annyeonghaseyo', 'Gamsahamnida', 'Jal gayo', 'Sillryehamnida'], answer: 'Annyeonghaseyo' },
    { id: 'k2', type: 'translate', question: 'Translate: "Thank you"', answer: 'Gamsahamnida' },
    { id: 'k3', type: 'multiple-choice', question: 'Which word means "Yes"?', options: ['Ne', 'Aniyo', 'Gwaenchanayo', 'Mianhaeyo'], answer: 'Ne' },
  ]
};

export const generateQuizQuestions = async (language: string, topic: string): Promise<QuizQuestion[]> => {
  const langKey = (language || 'spanish').toLowerCase();
  
  if (isMockMode || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    console.log(`[GeminiService] Using mock questions for: ${language || 'default'}`);
    const mockData = MOCK_QUESTIONS[langKey] || MOCK_QUESTIONS['spanish'];
    // Ensure all questions have options if they are multiple-choice
    return mockData.map(q => ({
      ...q,
      options: q.type === 'multiple-choice' ? (q.options || ['Option A', 'Option B', 'Option C', 'Option D']) : q.options
    }));
  }

  console.log(`[GeminiService] Calling Gemini API for ${language}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 interactive language learning questions for ${language} on the topic of "${topic}". 
      IMPORTANT: For 'multiple-choice' questions, you MUST provide an 'options' array with 4 distinct choices.
      Format the output as a JSON array of objects with keys: id, type, question, options (if multiple-choice), answer, explanation, audioText.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["multiple-choice", "translate", "match"] },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              audioText: { type: Type.STRING }
            },
            required: ["id", "type", "question", "answer"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    console.log(`[GeminiService] Successfully generated ${parsed.length} questions.`);
    return parsed;
  } catch (e) {
    console.error("[GeminiService] Generation/Parsing failed", e);
    // Fallback to mock even if not in mock mode if API fails
    return MOCK_QUESTIONS[langKey] || MOCK_QUESTIONS['spanish'];
  }
};
