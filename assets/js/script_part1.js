let books_block = document.querySelector('.books_block')
getBooks();

function getBooks(page = 1) {
    let link = 'http://localhost:8112';
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
                // let bookId = e.target.dataset.id;
                // window.location.href = link + '/items/' + bookId;
                // console.log(link + '/items/' + bookId);
                let link = '../templates/single.html'
                fetch(link).then(function (res) {
                    console.log(res)
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
        console.log(document.querySelector('#content').scrollHeight);
        document.getElementById('content').style.minHeight = document.querySelector('#content').scrollHeight + 'px';
        books_block.appendChild(pagination);
    });
}
