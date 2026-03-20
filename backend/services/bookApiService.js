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
    console.error('Gemini Error (About Book):', error.message);
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
    console.error('Gemini Error (About Author):', error.message);
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
 * Fetch book data from ISBNdb API (alternative source)
 */
async function fetchFromISBNdb(isbn) {
  // ISBNdb requires API key - skip if not configured
  if (!process.env.ISBNDB_API_KEY) {
    return null;
  }
  
  try {
    const response = await axios.get(
      `https://api2.isbndb.com/book/${isbn}`,
      {
        headers: {
          'Authorization': process.env.ISBNDB_API_KEY
        }
      }
    );

    if (!response.data || !response.data.book) {
      return null;
    }

    const bookData = response.data.book;
    const title = bookData.title || '';
    const author = bookData.authors ? bookData.authors.join(', ') : '';
    
    // Generate descriptions with AI if available
    const aboutBook = await generateAboutBookWithAI(title, author, bookData.synopsis || '');
    const aboutAuthor = await generateAboutAuthorWithAI(author);
    
    return {
      title: title,
      subtitle: bookData.title_long || '',
      author: author,
      aboutBook: aboutBook,
      aboutAuthor: aboutAuthor,
      publisher: bookData.publisher || '',
      publishedDate: bookData.date_published ? `${bookData.date_published}-01-01` : '',
      pages: bookData.pages || 0,
      language: bookData.language || 'English',
      categories: bookData.subjects ? bookData.subjects[0] : '',
      coverImage: bookData.image || '',
      isbn: isbn,
      source: 'ISBNdb'
    };
  } catch (error) {
    console.error('ISBNdb API Error:', error.message);
    return null;
  }
}

/**
 * Fetch book cover image from various sources
 */
async function fetchBookCoverImage(isbn) {
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // Try multiple cover image sources
  const coverSources = [
    // Google Books cover (best quality)
    `https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn=${cleanISBN}`,
    // Open Library cover (multiple sizes)
    `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg`,
    // Alternative Open Library
    `https://covers.openlibrary.org/b/isbn/${cleanISBN}-M.jpg`,
  ];
  
  // Try each source and return first valid image
  for (const url of coverSources) {
    try {
      const response = await axios.head(url, { timeout: 3000 });
      if (response.status === 200) {
        return url;
      }
    } catch (error) {
      // Continue to next source
      continue;
    }
  }
  
  return '';
}

/**
 * Generate complete book data using Gemini AI when not found in any API
 */
async function generateBookDataWithAI(isbn) {
  if (!genAI) {
    return null;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    // Ask Gemini to provide book information based on ISBN including cover image URL
    const prompt = `I have an ISBN: ${isbn}. Please provide the following information about this book in JSON format:
{
  "title": "Book title",
  "author": "Author name",
  "publisher": "Publisher name",
  "publishedYear": "YYYY",
  "pages": number,
  "language": "Language",
  "category": "Main category/genre",
  "coverImageUrl": "Direct URL to book cover image (try Google Books, Open Library, or Amazon)",
  "aboutBook": "200-word description about the book, plot, themes, and significance",
  "aboutAuthor": "100-word biography about the author"
}

For coverImageUrl, try these formats:
- Google Books: https://books.google.com/books/content?id=BOOK_ID&printsec=frontcover&img=1&zoom=1&isbn=ISBN
- Open Library: https://covers.openlibrary.org/b/isbn/ISBN-L.jpg
- If you know the book, provide the actual working cover image URL

If you cannot find information about this ISBN, respond with: {"found": false}

Important: Return ONLY valid JSON, no markdown formatting, no explanations.`;
    
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    const bookInfo = JSON.parse(text);
    
    if (bookInfo.found === false) {
      return null;
    }
    
    // Format the data
    const publishedDate = bookInfo.publishedYear ? `${bookInfo.publishedYear}-01-01` : '';
    
    // Use Gemini-provided cover URL or fallback to our fetch function
    let coverImage = bookInfo.coverImageUrl || '';
    
    // If Gemini didn't provide a valid URL, try our fallback sources
    if (!coverImage || coverImage === '' || coverImage === 'N/A') {
      coverImage = await fetchBookCoverImage(isbn);
    }
    
    return {
      title: bookInfo.title || '',
      subtitle: '',
      author: bookInfo.author || '',
      aboutBook: bookInfo.aboutBook || '',
      aboutAuthor: bookInfo.aboutAuthor || '',
      publisher: bookInfo.publisher || '',
      publishedDate: publishedDate,
      pages: parseInt(bookInfo.pages) || 0,
      language: bookInfo.language || 'English',
      categories: bookInfo.category || '',
      coverImage: coverImage,
      isbn: isbn,
      source: 'Gemini AI + Cover APIs'
    };
  } catch (error) {
    // Check if it's a quota error
    if (error.message && error.message.includes('quota')) {
      console.error('Gemini AI Quota Exceeded - Please generate a new API key');
    } else {
      console.error('Gemini AI Error:', error.message);
    }
    return null;
  }
}

/**
 * Fetch book data with sequential fallback system
 * Priority: Google Books → Open Library → ISBNdb → Gemini AI → Manual
 */
async function fetchBookByISBN(isbn) {
  // Clean ISBN (remove hyphens and spaces)
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  // Step 1: Try Google Books first
  const googleData = await fetchFromGoogleBooks(cleanISBN);
  if (googleData) {
    return googleData;
  }

  // Step 2: Try Open Library
  const openLibData = await fetchFromOpenLibrary(cleanISBN);
  if (openLibData) {
    return openLibData;
  }

  // Step 3: Try ISBNdb (if API key configured)
  if (process.env.ISBNDB_API_KEY) {
    const isbndbData = await fetchFromISBNdb(cleanISBN);
    if (isbndbData) {
      return isbndbData;
    }
  }

  // Step 4: Try Gemini AI as fallback (only if quota available)
  const aiData = await generateBookDataWithAI(cleanISBN);
  if (aiData) {
    return aiData;
  }

  // Step 5: All sources failed
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
  fetchFromISBNdb,
  fetchBookByTitle,
  generateBookDataWithAI,
  fetchBookCoverImage
};
