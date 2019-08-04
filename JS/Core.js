// CLASSES

/* Book Class: Represents a Book;
 * Everytime we Create a Book, this object will be Instantiated
 */
class Book {
    constructor(tittle, author, isbn) {
        this.tittle = tittle;
        this.author = author;
        this.isbn = isbn;
    }
}


/* UI Class: Handle UI Tasks
 * Every action realizated, like, (displaying a book, Removing a Book...) will be treated here
 */

class UI {
    static displayBook() {

        const books = Storage.getBooks();

        //Since it's an array, we can use FOR EACH to loop throught

        //Pointer Solution
        books.forEach((Book) => UI.addBookToList(Book));

        /* //Function
        books.forEach(function loopArray(Book) {
            Book = UI.addBookToList(Book);
        });  */

    };

    static addBookToList(Book) {
        const listBookID = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${Book.tittle}</td>
        <td>${Book.author}</td>
        <td>${Book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        listBookID.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#tittle').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBookFromList(childToRemove) {
        if (childToRemove.classList.contains('delete')) {
            childToRemove.parentElement.parentElement.remove();

            //Book Removed Alert
            UI.showAlert('Book deleted!', 'danger');
        }
    }

    static showAlert(message, className) {
        const divElement = document.createElement('div');
        divElement.className = `alert alert-${className} mt-4 text-center`;

        divElement.appendChild(document.createTextNode(message));

        const parentElement = document.querySelector('.containerBooKForm');
        const bookForm = document.querySelector('#book-form');

        parentElement.insertBefore(divElement, bookForm);

        //Make Alert disapear in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);

    }
}


/* Store Class: Handles Storage
 * Handles the Storage that will remain in the browser
 */
class Storage {
    static getBooks() {
        let books;

        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            //Comes in String, so we need to JSON to Object
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {

        const books = Storage.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();

        books.forEach((Book, index) => {
            if (Book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//EVENTS

/**
 * Event: Display a Book
 */
document.addEventListener('DOMContentLoaded', UI.displayBook);

/**
 * Event: Add a Book
 */
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //Prevent Actual Submit
    e.preventDefault();

    //GetFormValues
    const tittle = document.querySelector('#tittle').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (tittle === '' || author === '' || isbn === '') {
        //Book Not Added Alert
        UI.showAlert('Please, Fill in all the Fields!', 'danger');
    } else {
        //Instatiate Book
        const book = new Book(tittle, author, isbn);

        //Call addBookToList
        UI.addBookToList(book);

        //Add Book to Storage
        Storage.addBook(book);

        //Book Added Alert
        UI.showAlert('Book recorded with success!', 'success');

        //Clear Fields
        UI.clearFields();
    };
});

/**
 * Event: Remove a Book
 */
document.querySelector('#book-list').addEventListener('click', (e) => {

    //Remove Book from U.I
    UI.deleteBookFromList(e.target);

    //Remove Book from Storage
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

});