const gSearchQuery = (q) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=12`);
}

const getSelectedBook = (bookId) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
}

const searchCategoy = (c) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=+subject:${c}&orderBy=newest&maxResults=12`);
}

const googleSearchHandler = async (txt, type) => {
  if(!txt) {
    alert('please enter a query!');
  }
  // get results form google api
  try {
    const gResponse = await(gSearchQuery(txt));

    if(!gResponse.ok) {
      throw new Error('Something went wrong!');
    }

    const gBookData = await gResponse.json();

    if(gBookData.totalItems > 0) {

    const gBooks = gBookData.items.map((book) => {

      let isbnObj = {
        isbn13: '',
        isbn10: ''
      };
      
      if(book.volumeInfo.industryIdentifiers) {
        isbnObj = checkIsbn(book.volumeInfo.industryIdentifiers);
      }
      
      return {
        bookId: book.id,
        authors: book.volumeInfo.authors || [],
        title: book.volumeInfo.title || 'No Title Available',
        description: book.volumeInfo.description || '',
        categories: book.volumeInfo?.categories || [],
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        isbn13: isbnObj.isbn13,
        isbn10: isbnObj.isbn10,
        webReaderLink: book.accessInfo?.webReaderLink || '',
        googleListPrice: book.saleInfo.listPrice?.amount.toString() || '',
        googleRetailPrice: book.saleInfo.retailPrice?.amount.toString() || '',
        googlePlayBooks: book.volumeInfo?.infoLink || '',
        googleRatings: book.volumeInfo?.averageRating || 0,
        publishedDate: book.volumeInfo.publishedDate || '',
        publisher: book.volumeInfo.publisher || ''
        }
    });

    return gBooks;
    }
  } catch (e) {
    console.error(e);
  }
}; 

const checkIsbn = (isbnList) => {
  const isbnObj = {
    isbn10 : '',
    isbn13 : ''
  }

  isbnList.forEach(isbn => {
    if(isbn.type === 'ISBN_10') {
      isbnObj.isbn10 = isbn.identifier;
    } else if(isbn.type === 'ISBN_13') {
      isbnObj.isbn13 = isbn.identifier;
    }
  });

  return isbnObj;
}

const searchBook = {
  googleSearchHandler
}
export default searchBook