const currentUrl = window.location.href;

if (currentUrl.includes('home.html')) {
    let books_block = document.querySelector('.books_block')
    getBooks();

    function getBooks(page = 1) {
        books_block.innerHTML += ('<h2 class="booksHeader">Our Books</h2>');
        let link = 'http://localhost:8113';
        let linkBooks = link + '/items?_page=' + page + '&_per_page=20';
        console.log(linkBooks);
        axios.get(linkBooks).then(function (response) {
            let books = response.data.data;
            console.log(books);
            let books_container = document.createElement('div');
            books_container.id = 'books_container';
            for (let book of books) {
                let newBook = document.createElement('div');
                newBook.className = 'book';
                newBook.addEventListener('click', function (e) {
                    document.getElementById('content').style.minHeight = 'auto'
                    let bookId = this.dataset.id;

                    axios.get('http://localhost:8113/items/' + bookId).then(function (resBook) {

                        let titleJson = resBook.data.volumeInfo.title;
                        let imageJson = resBook.data.volumeInfo.imageLinks.thumbnail;
                        let autorsJson = resBook.data.volumeInfo.authors.join(', ');
                        let date = new Date(resBook.data.volumeInfo.publishedDate);

                        let year_bookJson = date.getFullYear();
                        let desc_bookJson = resBook.data.volumeInfo.description;
                        let ISBNJson = resBook.data.volumeInfo.industryIdentifiers[0].identifier
                        let book_page_countJSON = resBook.data.volumeInfo.pageCount
                        let book_publishedJSON = date.getUTCDate()
                        let book_publisherJSON = resBook.data.volumeInfo.publisher
                        let book_languageJSON = resBook.data.volumeInfo.language



                        console.log(ISBNJson);


                        let link = '../templates/single.html'
                        fetch(link)
                            .then(res => res.text())
                            .then(function (res) {
                                let parser = new DOMParser();
                                let doc = parser.parseFromString(res, 'text/html');

                                let titleBook = doc.querySelector('.title_book');
                                let imageBook = doc.querySelector('.img_book img');
                                let authors = doc.querySelector('.authors_book')
                                let year_book = doc.querySelector('.year_book')
                                let description_book = doc.querySelector('.description_book')
                                let book_isbn = doc.querySelector('.book_isbn').lastChild
                                let book_page_count = doc.querySelector('.book_page_count').lastChild
                                let book_published = doc.querySelector('.book_published').lastChild

                                let book_publisher = doc.querySelector('.book_publisher').lastChild
                                let book_language = doc.querySelector('.book_language').lastChild
                                let book_author = doc.querySelector('.book_author').lastChild

                                console.log(book_isbn)

                                titleBook.innerHTML = titleJson;
                                imageBook.src = imageJson;
                                authors.innerHTML = 'By ' + autorsJson
                                year_book.innerHTML = year_bookJson
                                description_book.innerHTML = desc_bookJson;
                                book_isbn.innerHTML = ISBNJson;
                                book_page_count.innerHTML = book_page_countJSON;
                                book_published.innerHTML = book_publishedJSON;
                                book_publisher.innerHTML = book_publisherJSON;
                                book_language.innerHTML = book_languageJSON;
                                book_author.innerHTML = autorsJson;

                                books_block.innerHTML = doc.querySelector('.single_book').outerHTML;

                            });
                    });

                });
                newBook.dataset.id = book.id;
                if (book.volumeInfo.imageLinks) {
                    newBook.innerHTML = `<img src=${book.volumeInfo.imageLinks.thumbnail}></img>`
                }
                else {
                    newBook.innerHTML = `<img src='../assets/images/no_image.jpg'></img>`

                }
                newBook.innerHTML += `<h3>${book.volumeInfo.title}</h3>`
                if (book.volumeInfo.authors) {
                    newBook.innerHTML += `<p>${book.volumeInfo.authors[0]}</p>`;
                }
                books_container.appendChild(newBook);

            }
            document.getElementById('content').style.minHeight = 'auto'
            books_block.appendChild(books_container);

            let pagination = document.createElement('div');
            for (let i = 0; i < response.data.pages; i++) {
                ;

                pagination.id = 'pagination';
                let btn = document.createElement('button');
                btn.innerHTML = i + 1;
                btn.dataset.id = i + 1;
                btn.addEventListener('click', function (e) {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                    document.getElementById('pagination').remove()
                    document.getElementById('books_container').remove()
                    let btnClicled = e.target;
                    getBooks(btnClicled.dataset.id);
                });
                pagination.appendChild(btn);

            }

            document.getElementById('content').style.minHeight = document.querySelector('#content').scrollHeight + 'px';
            books_block.appendChild(pagination);
        });
    }
}
else if (currentUrl.includes('form_book.html')) {
    let form_create = document.querySelector('#create_book_form');
    form_create.addEventListener('submit', function (e) {
        e.preventDefault();
        let image_url = document.querySelector('input[name="img_url_form"]').value;
        let title_book = document.querySelector('input[name="title_book_form"]').value;
        let authors_book = document.querySelector('input[name="authors_book_form"]').value;
        let book_published = document.querySelector('input[name="book_published_form"]').value;
        let book_isbn = document.querySelector('input[name="book_isbn_form"]').value;
        let book_page_count = document.querySelector('input[name="book_page_count_form"]').value;
        let book_publisher = document.querySelector('input[name="book_publisher_form"]').value;
        let book_language = document.querySelector('input[name="book_language_form"]').value;

        axios.post('http://localhost:8113/items', {
            'volumeInfo': {
                'imageLinks': {
                    'thumbnail': image_url
                },
                'title': title_book,
                'authors': [authors_book],
                'publishedDate': book_published,
                'industryIdentifiers': [
                    {
                        'type': 'ISBN_13',
                        'identifier': book_isbn
                    }
                ],
                'pageCount': book_page_count,
                'publisher': book_publisher,
                'language': book_language
            }
        })
        console.log(image_url);

    });
}

axios.get('http://localhost:8113/items/?q=Society').then(function (resBook) {
    console.log(resBook.data);
})

