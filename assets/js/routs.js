async function loadPage(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        document.getElementById('content').innerHTML = text;
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('content').innerText = 'Error loading page.';
    }
}

function getPageFromUrl() {
    const path = window.location.pathname;
    console.log(path);
    switch (path) {
        case '/home':
            return './home.html';
        case '/about':
            return './about.html';
        default:
            return './home.html'; // Default page
    }
}


// Load the appropriate page based on the current URL
const pageUrl = getPageFromUrl();
loadPage(pageUrl);


(() => {
    const includes = document.getElementsByTagName('include');
    [].forEach.call(includes, i => {
        let filePath = i.getAttribute('src');
        fetch(filePath).then(file => {
            file.text().then(content => {
                i.insertAdjacentHTML('afterend', content);
                i.remove();
            });
        }).catch(err => { console.error(err); });
    });
})();

