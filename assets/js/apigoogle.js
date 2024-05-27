
// Ваш API-ключ
const apiKey = 'AIzaSyCrWZoKTlblJqv1eV3NQ48xlAgyuEgTI6Y';

// Список случайных поисковых запросов
const queries = ['fiction', 'mystery', 'fantasy', 'science', 'history', 'romance', 'horror', 'adventure', 'biography', 'children'];

// Выбор случайного запроса
const query = queries[Math.floor(Math.random() * queries.length)];

// Функция для получения книг с заданного индекса
async function fetchBooks(startIndex) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=40&startIndex=${startIndex}`;
    try {
        const response = await axios.get(url);
        return response.data.items || [];
    } catch (error) {
        console.error('Ошибка при выполнении запроса', error);
        return [];
    }
}

// Функция для получения всех книг
async function fetchAllBooks() {
    let books = [];
    let startIndex = 0;
    let newBooks;

    do {
        newBooks = await fetchBooks(startIndex);
        books = books.concat(newBooks);
        startIndex += 40;
    } while (newBooks.length > 0);

    return books;
}

// Выполнение основного процесса
fetchAllBooks().then(books => {
    const data = { items: books };

    // Создание файла JSON и его скачивание
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'random_books.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Данные успешно экспортированы в random_books.json');
});
