const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

// Initialize Gemini only if API key exists
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized');
  } else {
    console.log('⚠️ GEMINI_API_KEY not set - using fallback descriptions');
  }
} catch (error) {
  console.error('❌ Gemini initialization error:', error.message);
  genAI = null;
}

// Retry helper with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === maxRetries - 1;
      const isRateLimitError = error.message?.includes('503') || 
                               error.message?.includes('high demand') ||
                               error.message?.includes('overloaded');
      
      if (isLastRetry || !isRateLimitError) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function generateAboutBook(title, author, existingDescription = '') {
  try {
    if (!genAI) {
      return existingDescription || `${title} by ${author} is a notable work in literature.`;
    }
    
    console.log(`🤖 Gemini: Generating About Book for "${title}"`);
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      });
      const prompt = `Write a concise 150-word description about the book "${title}" by ${author}. Include plot overview, main themes, and why it's significant. Be informative and engaging.`;
      return await model.generateContent(prompt);
    });
    
    const text = result.response.text();
    console.log('✅ About Book generated');
    
    // Clean markdown formatting
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();
    
    return cleanText;
  } catch (error) {
    console.error('❌ Gemini Error (About Book):', error.message);
    // Return fallback
    return existingDescription || `${title} by ${author} is a notable work in literature. This book has captivated readers with its compelling narrative and thought-provoking themes.`;
  }
}

async function generateAboutAuthor(author) {
  try {
    if (!genAI) {
      return `${author} is a renowned author.`;
    }
    
    console.log(`🤖 Gemini: Generating About Author for "${author}"`);
    
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      });
      const prompt = `Write a concise 80-word biography about author ${author}. Include their background, notable works, and literary significance. Be informative.`;
      return await model.generateContent(prompt);
    });
    
    const text = result.response.text();
    console.log('✅ About Author generated');
    
    // Clean markdown formatting
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();
    
    return cleanText;
  } catch (error) {
    console.error('❌ Gemini Error (About Author):', error.message);
    // Return fallback
    return `${author} is a renowned author known for their significant contributions to literature. Their works have been widely acclaimed and continue to inspire readers worldwide.`;
  }
}

async function generateBookContent(title, author, existingDescription = '') {
  try {
    console.log('🚀 Gemini: Starting generation with retry logic...');
    
    // Generate sequentially to avoid rate limits
    const aboutBook = await generateAboutBook(title, author, existingDescription);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const aboutAuthor = await generateAboutAuthor(author);
    
    console.log('✅ Both generated successfully!');
    return { aboutBook, aboutAuthor };
  } catch (error) {
    console.error('❌ Error in generateBookContent:', error.message);
    return {
      aboutBook: existingDescription || `${title} by ${author} is a notable work in literature. This book has captivated readers with its compelling narrative and thought-provoking themes.`,
      aboutAuthor: `${author} is a renowned author known for their significant contributions to literature. Their works have been widely acclaimed and continue to inspire readers worldwide.`
    };
  }
}

// Export functions
module.exports = {
  generateAboutBook,
  generateAboutAuthor,
  generateBookContent
};
