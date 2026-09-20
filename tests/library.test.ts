import { expect } from 'chai';
import { Library } from '../src/services/Library';
import { Book } from '../src/models/Book';
import { User } from '../src/models/User';

describe('Library<T> Generic Class Tests', () => {
    describe('Book Collection Management', () => {
        let bookLibrary: Library<Book>;

        beforeEach(() => {
            bookLibrary = new Library<Book>();
        });

        it('should add a book to the library', () => {
            const book = new Book('1', 'Clean Code', 'Robert Martin', 2008);
            bookLibrary.add(book);

            const all = bookLibrary.getAll();
            expect(all).to.have.lengthOf(1);
            expect(all[0].title).to.equal('Clean Code');
        });

        it('should throw an error when adding book with duplicate id', () => {
            const book1 = new Book('1', 'Book 1', 'Author 1', 2000);
            const book2 = new Book('1', 'Book 2', 'Author 2', 2005);
            bookLibrary.add(book1);

            expect(() => bookLibrary.add(book2)).to.throw('Елемент з id 1 вже існує.');
        });

        it('should remove a book by id', () => {
            const book = new Book('1', 'Refactoring', 'Martin Fowler', 1999);
            bookLibrary.add(book);
            const isRemoved = bookLibrary.remove('1');

            expect(isRemoved).to.be.true;
            expect(bookLibrary.getAll()).to.be.empty;
        });

        it('should find a book by predicate', () => {
            const book1 = new Book('1', 'Design Patterns', 'GoF', 1994);
            const book2 = new Book('2', 'Code Complete', 'Steve McConnell', 2004);
            bookLibrary.add(book1);
            bookLibrary.add(book2);

            const found = bookLibrary.find((b) => b.author.includes('McConnell'));
            expect(found).to.not.be.undefined;
            expect(found?.title).to.equal('Code Complete');
        });
    });

    describe('User Collection Management', () => {
        let userLibrary: Library<User>;

        beforeEach(() => {
            userLibrary = new Library<User>();
        });

        it('should correctly manage generic users', () => {
            const user = new User('1725533394038', 'Артем', 'artem@gmail.com');
            userLibrary.add(user);

            const fetched = userLibrary.findById('1725533394038');
            expect(fetched).to.not.be.undefined;
            expect(fetched?.name).to.equal('Артем');
        });
    });
});