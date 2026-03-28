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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
    // Try with both ISBN formats (with and without hyphens)
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const queries = [
      `isbn:${cleanISBN}`,
      `isbn:${isbn}`,
    ];
    
    for (const query of queries) {
      try {
        console.log(`🔍 Google Books: Trying query "${query}"`);
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}`,
          { timeout: 5000 }
        );

        if (response.data.totalItems > 0) {
          const bookData = response.data.items[0].volumeInfo;
          
          // Verify ISBN matches (important to avoid wrong books)
          const bookISBNs = bookData.industryIdentifiers || [];
          const hasMatchingISBN = bookISBNs.some(id => 
            id.identifier.replace(/[-\s]/g, '') === cleanISBN
          );
          
          if (!hasMatchingISBN) {
            console.log('⚠️ ISBN mismatch, skipping this result');
            continue;
          }
          
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
          
          console.log(`✅ Found: ${title} by ${author}`);
          
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
            isbn: cleanISBN,
            source: 'Google Books + Gemini AI'
          };
        }
      } catch (queryError) {
        console.log(`⚠️ Query failed: ${queryError.message}`);
        continue;
      }
    }
    
    return null;
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
 * Generate complete book data using Gemini AI
 * 
 * ⚠️ DISABLED: This function is disabled due to reliability issues
 * 
 * PROBLEM: ISBN databases on the web are inconsistent and conflicting
 * - Same ISBN can appear for multiple different books
 * - Regional editions, reprints, and eBooks cause confusion
 * - No way to verify which source is correct
 * - Gemini cannot reliably distinguish between conflicting data
 * 
 * EXAMPLE: ISBN 9789386235039 shows as:
 * - "Wings of Fire" by Dr. A.P.J. Abdul Kalam (Digital Edition)
 * - "The Art of Living" by Swami Mukundananda (Database error)
 * - "Quantitative Aptitude" by R.S. Aggarwal (Wrong indexing)
 * 
 * SOLUTION: Use only verified APIs (Google Books, Open Library, ISBNdb)
 * If book not found there, manual entry is the most reliable option.
 */
async function generateBookDataWithAI(isbn) {
  console.log('⚠️ Gemini ISBN lookup is disabled');
  console.log('📚 Reason: ISBN databases have conflicting/unreliable data');
  console.log('💡 Solution: Use manual entry for accurate book information');
  return null;
  
  /* DISABLED CODE - DO NOT ENABLE WITHOUT FIXING RELIABILITY ISSUES
  if (!genAI) {
    console.log('⚠️ Gemini AI not configured');
    return null;
  }
  
  try {
    console.log(\`🤖 Gemini: Searching web for ISBN \${isbn}...\`);
    
    // Use gemini-2.5-flash (stable model for v1beta API)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.1, // Very low temperature for factual accuracy
        maxOutputTokens: 3000, // Increased for complete responses
      }
    });
    
    // ... rest of the code ...
  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);
    return null;
  }
  */
}

/**
 * Fetch book data with sequential fallback system
 * Priority: Google Books → Open Library → ISBNdb → Manual Entry
 * 
 * Note: Gemini AI ISBN lookup is permanently disabled due to:
 * - Conflicting ISBN data across web sources
 * - Same ISBN appearing for multiple different books
 * - No reliable way to verify correct book
 * 
 * For best results:
 * 1. Use Google Books API (most reliable)
 * 2. Fallback to Open Library
 * 3. If not found, manual entry ensures accuracy
 */
async function fetchBookByISBN(isbn) {
  // Clean ISBN (remove hyphens and spaces)
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  console.log(`📚 Fetching book data for ISBN: ${cleanISBN}`);

  // Step 1: Try Google Books first (most reliable)
  console.log('🔍 Step 1: Trying Google Books API...');
  const googleData = await fetchFromGoogleBooks(cleanISBN);
  if (googleData) {
    console.log('✅ Found in Google Books');
    return googleData;
  }

  // Step 2: Try Open Library
  console.log('🔍 Step 2: Trying Open Library API...');
  const openLibData = await fetchFromOpenLibrary(cleanISBN);
  if (openLibData) {
    console.log('✅ Found in Open Library');
    return openLibData;
  }

  // Step 3: Try ISBNdb (if API key configured)
  if (process.env.ISBNDB_API_KEY) {
    console.log('🔍 Step 3: Trying ISBNdb API...');
    const isbndbData = await fetchFromISBNdb(cleanISBN);
    if (isbndbData) {
      console.log('✅ Found in ISBNdb');
      return isbndbData;
    }
  }

  // Step 4: Gemini AI disabled - unreliable for ISBN lookup
  // Reason: Web has conflicting ISBN data, same ISBN for multiple books
  
  // Step 5: All sources failed - manual entry is most reliable
  console.log('❌ ISBN not found in verified sources');
  console.log('💡 Please enter book details manually for accuracy');
  console.log('📝 Manual entry ensures correct book information');
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
