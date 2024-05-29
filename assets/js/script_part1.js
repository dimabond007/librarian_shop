const currentUrl = window.location.href;
let books_block = document.querySelector('.books_block');
let btn_delete_book = document.querySelector('.delete_book');
let btn_edit_book = document.querySelector('.edit_book');

if (currentUrl.includes('home.html')) {
    getBooks();
} else if (currentUrl.includes('form_book.html')) {
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
        });

    });
}

function getBooks(page = 1, pagination = true) {
    if (document.querySelector('.booksHeader'))
        document.querySelector('.booksHeader').remove();
    books_block.innerHTML += ('<h2 class="booksHeader">Our Books</h2>');
    let link = 'http://localhost:8113';
    let linkBooks = link + '/items?_page=' + page + '&_per_page=20';
    axios.get(linkBooks).then(function (response) {
        show_books(response.data.data, true, response);
    });
}

function show_books(books, pagination = true, response) {
    let books_container = document.createElement('div');
    books_container.id = 'books_container';
    for (let book of books) {
        let newBook = document.createElement('div');
        newBook.className = 'book';
        newBook.addEventListener('click', function (e) {
            document.getElementById('content').style.minHeight = 'auto';
            let bookId = this.dataset.id;

            axios.get('http://localhost:8113/items/' + bookId).then(function (resBook) {

                let titleJson = resBook.data.volumeInfo.title;
                let imageJson = resBook.data.volumeInfo.imageLinks.thumbnail;
                let autorsJson = resBook.data.volumeInfo.authors.join(', ');
                let date = new Date(resBook.data.volumeInfo.publishedDate);

                let year_bookJson = date.getFullYear();
                let desc_bookJson = resBook.data.volumeInfo.description;
                let ISBNJson = resBook.data.volumeInfo.industryIdentifiers[0].identifier;
                let book_page_countJSON = resBook.data.volumeInfo.pageCount;
                let book_publishedJSON = date.getUTCDate();
                let book_publisherJSON = resBook.data.volumeInfo.publisher;
                let book_languageJSON = resBook.data.volumeInfo.language;

                let link = '../templates/single.html';
                fetch(link)
                    .then(res => res.text())
                    .then(function (res) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(res, 'text/html');

                        let titleBook = doc.querySelector('.title_book');
                        let imageBook = doc.querySelector('.img_book img');
                        let authors = doc.querySelector('.authors_book');
                        let year_book = doc.querySelector('.year_book');
                        let description_book = doc.querySelector('.description_book');
                        let book_isbn = doc.querySelector('.book_isbn').lastChild;
                        let book_page_count = doc.querySelector('.book_page_count').lastChild;
                        let book_published = doc.querySelector('.book_published').lastChild;
                        let book_publisher = doc.querySelector('.book_publisher').lastChild;
                        let book_language = doc.querySelector('.book_language').lastChild;
                        let book_author = doc.querySelector('.book_author').lastChild;

                        titleBook.innerHTML = titleJson;
                        imageBook.src = imageJson;
                        authors.innerHTML = 'By ' + autorsJson;
                        year_book.innerHTML = year_bookJson;
                        description_book.innerHTML = desc_bookJson;
                        book_isbn.innerHTML = ISBNJson;
                        book_page_count.innerHTML = book_page_countJSON;
                        book_published.innerHTML = book_publishedJSON;
                        book_publisher.innerHTML = book_publisherJSON;
                        book_language.innerHTML = book_languageJSON;
                        book_author.innerHTML = autorsJson;

                        books_block.innerHTML = doc.querySelector('.single_book').outerHTML;

                        btn_delete_book = document.querySelector('.delete_book');
                        btn_edit_book = document.querySelector('.edit_book');

                        btn_delete_book.dataset.id = bookId;
                        btn_edit_book.dataset.id = bookId;

                        btn_delete_book.addEventListener('click', delete_book)
                        btn_edit_book.addEventListener('click', edit_book)
                    });
            });

        });
        newBook.dataset.id = book.id;
        if (book.volumeInfo.imageLinks) {
            newBook.innerHTML = `<img src=${book.volumeInfo.imageLinks.thumbnail}></img>`;
        } else {
            newBook.innerHTML = `<img src='../assets/images/no_image.jpg'></img>`;
        }
        newBook.innerHTML += `<h3>${book.volumeInfo.title}</h3>`;
        if (book.volumeInfo.authors) {
            newBook.innerHTML += `<p>${book.volumeInfo.authors[0]}</p>`;
        }
        books_container.appendChild(newBook);

    }
    document.getElementById('content').style.minHeight = 'auto';
    books_block.appendChild(books_container);
    document.getElementById('content').style.minHeight = document.querySelector('#content').scrollHeight + 'px';
    if (pagination) {
        let pagination = get_pagination(response);
        books_block.appendChild(pagination);
    }
}

function get_pagination(response) {
    let pagination = document.createElement('div');
    for (let i = 0; i < response.data.pages; i++) {
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
            document.getElementById('pagination').remove();
            document.getElementById('books_container').remove();
            let btnClicled = e.target;
            getBooks(btnClicled.dataset.id);
        });
        pagination.appendChild(btn);
    }
    return pagination;
}

function delete_book() {
    let bookId = this.dataset.id;
    axios.delete('http://localhost:8113/items/' + bookId).then(function (response) {
        getBooks();
    });
}

function edit_book() {
    let bookId = this.dataset.id;
    axios.get('http://localhost:8113/items/' + bookId).then(function (response) {
        let book = response.data;
        console.log(response);
        let modal = document.createElement('div');
        modal.classList.add('modal_edit_book');
        modal.innerHTML = `
        <div class='edit_container form_book'>
            <form action="" id="edit_book_form">
                <input type="text" name="img_url_form" class="createInputs" placeholder="Please enter image URL" required>
                <input type="text" name="title_book_form" class="createInputs" placeholder="Please enter Book title" required>
                <input type="text" name="authors_book_form" class="createInputs" placeholder="Please enter authors" required>
                <input type="text" name="book_published_form" class="createInputs" placeholder="Please enter date of book published"
                    required>
                <input type="text" name="book_isbn_form" class="createInputs" placeholder="Please enter ISBN" required>
                <input type="text" name="book_page_count_form" class="createInputs" placeholder="Please enter pages of book" required>
                <input type="text" name="book_publisher_form" class="createInputs" placeholder="Please enter name of publisher" required>
                <input type="text" name="book_language_form" class="createInputs" placeholder="Please enter language of book" required>
                <textarea name="book_description_form" class="textarea" placeholder="Please enter description of book" required></textarea>
                <button type="submit" class="createButton" >Create book</button>
            </form>
        </div>`;

        let img_url_form = modal.querySelector('input[name="img_url_form"]')
        let title_book_form = modal.querySelector('input[name="title_book_form"]')
        let authors_book_form = modal.querySelector('input[name="authors_book_form"]')
        let book_published_form = modal.querySelector('input[name="book_published_form"]')
        let book_isbn_form = modal.querySelector('input[name="book_isbn_form"]')
        let book_page_count_form = modal.querySelector('input[name="book_page_count_form"]')
        let book_publisher_form = modal.querySelector('input[name="book_publisher_form"]')
        let book_language_form = modal.querySelector('input[name="book_language_form"]')
        let book_description_form = modal.querySelector('textarea[name="book_description_form"]')


        let titleJson = book.volumeInfo.title;
        let imageJson = book.volumeInfo.imageLinks.thumbnail;
        let autorsJson = book.volumeInfo.authors.join(', ');
        let date = new Date(book.volumeInfo.publishedDate);
        console.log(titleJson);
        let year_bookJson = date.getFullYear();
        let desc_bookJson = book.volumeInfo.description;
        let ISBNJson = book.volumeInfo.industryIdentifiers[0].identifier;
        let book_page_countJSON = book.volumeInfo.pageCount;
        let book_publisherJSON = book.volumeInfo.publisher;
        let book_languageJSON = book.volumeInfo.language;

        img_url_form.value = imageJson;
        title_book_form.value = titleJson;
        authors_book_form.value = autorsJson;
        book_published_form.value = year_bookJson;
        book_isbn_form.value = ISBNJson;
        book_page_count_form.value = book_page_countJSON;
        book_publisher_form.value = book_publisherJSON;
        book_language_form.value = book_languageJSON;
        book_description_form.value = desc_bookJson;

        //let form = document.querySelector('#edit_book_form');

        //form.addEventListener('submit', async function (e) { });


        document.querySelector('#content').appendChild(modal);
    });
    console.log("edit_book");
}

let searchHandlerAttached = false;
function attachSearchHandler() {
    if (searchHandlerAttached) return;
    let btn_search = document.getElementsByClassName('btn_search')[0];
    if (btn_search) {
        btn_search.addEventListener('click', async function () {
            let search_input = document.querySelector('.search_input').value.toLowerCase();

            let count_books = 0;
            let arr_books = [];
            let page = 1;
            let flag = true;
            let seenItems = new Set();

            while (count_books < 20 && flag) {
                try {
                    let resBook = await axios.get('http://localhost:8113/items/?_page=' + page + '&_per_page=40');
                    let books = resBook.data.data;
                    console.log(resBook);

                    if (Array.isArray(books)) {
                        if (books.length === 0) {
                            flag = false;
                            break;
                        }

                        let newItemsFound = false;
                        for (let item of books) {
                            if (!seenItems.has(item.id) && item.volumeInfo.title.toLowerCase().includes(search_input)) {
                                arr_books.push(item);
                                seenItems.add(item.id);
                                console.log(item.volumeInfo.title);
                                count_books++;
                                newItemsFound = true;
                                if (count_books >= 20) {
                                    flag = false;
                                    break;
                                }
                            }
                        }

                        if (!newItemsFound) {
                            flag = false;
                        }
                        page++;
                    } else {
                        console.error('Expected an array but got:', books);
                        flag = false;
                    }
                } catch (error) {
                    flag = false;
                    console.log('Error:', error);
                }
            }
            books_block.innerHTML = '';
            show_books(arr_books, false);

            console.log('Found books:', arr_books);
        });
        console.log("Handler attached to btn_search");
        searchHandlerAttached = true;
    } else {
        console.error("Button with class 'btn_search' not found.");
    }
}

// Настраиваем MutationObserver для наблюдения за изменениями в DOM
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            attachSearchHandler(); // Пробуем привязать обработчик при изменениях в DOM
        }
    }
});

// Начинаем наблюдение за изменениями в DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});

