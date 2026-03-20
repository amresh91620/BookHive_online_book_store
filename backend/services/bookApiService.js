const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate About Book using Gemini AI
 */
async function generateAboutBookWithAI(title, author, existingDescription) {
  if (!genAI) {
    return existingDescription || `${title} by ${author} is a notable work.`;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Write a compelling 200-word description about the book "${title}" by ${author}. Include the plot, main themes, and why it's significant. Make it engaging for readers.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean markdown formatting for database storage
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove bold **text**
      .replace(/\*/g, '')    // Remove italic *text*
      .replace(/#{1,6}\s/g, '') // Remove headers # ## ###
      .replace(/`/g, '')     // Remove code backticks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links [text](url) -> text
      .trim();
    
    return cleanText;
  } catch (error) {
    console.error('❌ Gemini Error (About Book):', error.message);
    console.error('📋 Full error:', error);
    return existingDescription || `${title} by ${author} is a notable work.`;
  }
}

/**
 * Generate About Author using Gemini AI
 */
async function generateAboutAuthorWithAI(author) {
  if (!genAI) {
    return `${author} is a renowned author.`;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Write a concise 100-word biography about the author ${author}. Include their background, notable works, writing style, and significance in literature.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean markdown formatting for database storage
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove bold **text**
      .replace(/\*/g, '')    // Remove italic *text*
      .replace(/#{1,6}\s/g, '') // Remove headers # ## ###
      .replace(/`/g, '')     // Remove code backticks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links [text](url) -> text
      .trim();
    
    return cleanText;
  } catch (error) {
    console.error('❌ Gemini Error (About Author):', error.message);
    console.error('📋 Full error:', error);
    return `${author} is a renowned author.`;
  }
}

/**
 * Fetch book data from Google Books API
 */
async function fetchFromGoogleBooks(isbn) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    if (response.data.totalItems === 0) {
      return null;
    }

    const bookData = response.data.items[0].volumeInfo;
    
    // Clean and format the description
    let existingDescription = bookData.description || '';
    existingDescription = existingDescription.replace(/<[^>]*>/g, '');
    
    const title = bookData.title || '';
    const author = bookData.authors ? bookData.authors.join(', ') : '';
    
    // Generate with Gemini AI
    const aboutBook = await generateAboutBookWithAI(title, author, existingDescription);
    const aboutAuthor = await generateAboutAuthorWithAI(author);
    
    // Parse published date to YYYY-MM-DD format
    let publishedDate = bookData.publishedDate || '';
    if (publishedDate) {
      // Handle different date formats: "1884", "1884-01", "1884-01-15"
      const dateParts = publishedDate.split('-');
      if (dateParts.length === 1) {
        // Only year: "1884" -> "1884-01-01"
        publishedDate = `${dateParts[0]}-01-01`;
      } else if (dateParts.length === 2) {
        // Year and month: "1884-01" -> "1884-01-01"
        publishedDate = `${dateParts[0]}-${dateParts[1]}-01`;
      }
      // else: already in YYYY-MM-DD format
    }
    
    return {
      title: title,
      subtitle: bookData.subtitle || '',
      author: author,
      aboutBook: aboutBook,
      aboutAuthor: aboutAuthor,
      publisher: bookData.publisher || '',
      publishedDate: publishedDate,
      pages: bookData.pageCount || 0,
      language: bookData.language === 'en' ? 'English' : bookData.language || 'English',
      categories: bookData.categories ? bookData.categories[0] : '',
      coverImage: bookData.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                  bookData.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '',
      isbn: isbn,
      source: 'Google Books + Gemini AI'
    };
  } catch (error) {
    console.error('Google Books API Error:', error.message);
    return null;
  }
}

/**
 * Fetch book data from Open Library API
 */
async function fetchFromOpenLibrary(isbn) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );

    const bookKey = `ISBN:${isbn}`;
    if (!response.data[bookKey]) {
      return null;
    }

    const bookData = response.data[bookKey];
    
    const title = bookData.title || '';
    const author = bookData.authors ? bookData.authors.map(a => a.name).join(', ') : '';
    const existingDescription = bookData.notes || bookData.subtitle || '';
    
    // Generate with Gemini AI
    const aboutBook = await generateAboutBookWithAI(title, author, existingDescription);
    const aboutAuthor = await generateAboutAuthorWithAI(author);
    
    // Parse published date
    let publishedDate = bookData.publish_date || '';
    if (publishedDate) {
      // Try to parse various date formats
      const yearMatch = publishedDate.match(/\d{4}/);
      if (yearMatch) {
        publishedDate = `${yearMatch[0]}-01-01`;
      }
    }
    
    return {
      title: title,
      author: author,
      aboutBook: aboutBook,
      aboutAuthor: aboutAuthor,
      publisher: bookData.publishers ? bookData.publishers[0].name : '',
      publishedDate: publishedDate,
      pages: bookData.number_of_pages || 0,
      language: 'English',
      categories: bookData.subjects ? bookData.subjects[0].name : '',
      coverImage: bookData.cover?.large || bookData.cover?.medium || bookData.cover?.small || '',
      isbn: isbn,
      source: 'Open Library + Gemini AI'
    };
  } catch (error) {
    console.error('Open Library API Error:', error.message);
    return null;
  }
}

/**
 * Fetch book data from both APIs and return the best result
 */
async function fetchBookByISBN(isbn) {
  // Clean ISBN (remove hyphens and spaces)
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  // Try Open Library first (no rate limit), then Google Books
  const [openLibData, googleData] = await Promise.all([
    fetchFromOpenLibrary(cleanISBN),
    fetchFromGoogleBooks(cleanISBN)
  ]);

  // Prefer Google Books if available (better data), fallback to Open Library
  if (googleData) {
    return googleData;
  }
  
  if (openLibData) {
    return openLibData;
  }

  return null;
}

/**
 * Fetch book data by title and author (when ISBN is not available)
 */
async function fetchBookByTitle(title, author = '') {
  try {
    const query = author ? `intitle:${title}+inauthor:${author}` : `intitle:${title}`;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );

    if (response.data.totalItems === 0) {
      return null;
    }

    const bookData = response.data.items[0].volumeInfo;
    
    // Extract author information
    let aboutAuthor = '';
    if (bookData.authors && bookData.authors.length > 0) {
      aboutAuthor = `${bookData.authors[0]} is the author of this book.`;
    }
    
    // Clean description
    let aboutBook = bookData.description || '';
    aboutBook = aboutBook.replace(/<[^>]*>/g, '');
    
    return {
      title: bookData.title || '',
      subtitle: bookData.subtitle || '',
      author: bookData.authors ? bookData.authors.join(', ') : '',
      aboutBook: aboutBook,
      aboutAuthor: aboutAuthor,
      publisher: bookData.publisher || '',
      publishedDate: bookData.publishedDate || '',
      pages: bookData.pageCount || 0,
      language: bookData.language === 'en' ? 'English' : bookData.language || 'English',
      categories: bookData.categories ? bookData.categories[0] : '',
      coverImage: bookData.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                  bookData.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '',
      isbn: bookData.industryIdentifiers ? bookData.industryIdentifiers[0].identifier : '',
      source: 'Google Books'
    };
  } catch (error) {
    console.error('Google Books Title Search Error:', error.message);
    return null;
  }
}

module.exports = {
  fetchBookByISBN,
  fetchFromGoogleBooks,
  fetchFromOpenLibrary,
  fetchBookByTitle
};
