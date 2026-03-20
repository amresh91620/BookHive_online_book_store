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

async function generateAboutBook(title, author, existingDescription = '') {
  try {
    if (!genAI) {
      return existingDescription || `${title} by ${author} is a notable work in literature.`;
    }
    
    console.log(`🤖 Gemini: Generating About Book for "${title}"`);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Write 200 words about "${title}" by ${author}. Include plot, themes, significance.`;
    const result = await model.generateContent(prompt);
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
    console.error('❌ Gemini Error:', error.message);
    return existingDescription || `${title} by ${author} is a notable work.`;
  }
}

async function generateAboutAuthor(author) {
  try {
    if (!genAI) {
      return `${author} is a renowned author.`;
    }
    
    console.log(`🤖 Gemini: Generating About Author for "${author}"`);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Write 100 words about author ${author}. Include background, works, significance.`;
    const result = await model.generateContent(prompt);
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
    console.error('❌ Gemini Error:', error.message);
    return `${author} is a renowned author.`;
  }
}

async function generateBookContent(title, author, existingDescription = '') {
  try {
    console.log('🚀 Gemini: Starting generation...');
    const [aboutBook, aboutAuthor] = await Promise.all([
      generateAboutBook(title, author, existingDescription),
      generateAboutAuthor(author)
    ]);
    console.log('✅ Both generated!');
    return { aboutBook, aboutAuthor };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return {
      aboutBook: existingDescription || `${title} by ${author} is a notable work.`,
      aboutAuthor: `${author} is a renowned author.`
    };
  }
}

// Export functions
module.exports = {
  generateAboutBook,
  generateAboutAuthor,
  generateBookContent
};
