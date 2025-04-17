import { Component, OnInit } from '@angular/core';
import { Books } from '../../Books';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../common-service/auth.service';

declare var bootstrap: any; 

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  books = Books;
  selectedBook: any;
  readingBook:any;


  constructor(
    private route: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    const localBooks = localStorage.getItem('purchasedBooks');
    this.books = localBooks ? JSON.parse(localBooks) : this.books;

    this.readingBook = localStorage.getItem('currentBookId');

  }

  openPurchaseModal(book: any) {
    this.selectedBook = book;
    const modalEl = document.getElementById('purchaseModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  confirmPurchase() {
    const bookId = this.selectedBook.id;
    const index = this.books.findIndex(book => book.id === bookId);
    if (index !== -1) {
      this.books[index].purchased = true;
      localStorage.setItem('purchasedBooks', JSON.stringify(this.books));
    }

    const modalEl = document.getElementById('purchaseModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  purchaseBook(bookId: string) {
    const index = this.books.findIndex(book => book.id === bookId);
    if (index !== -1) {
      this.books[index].purchased = true;
  
      // ✅ Save updated full book list to 'purchasedBooks'
      localStorage.setItem('purchasedBooks', JSON.stringify(this.books));
    }
  }
  

  readBook(bookId: string) {
    localStorage.setItem('currentBookId', bookId);
    this.route.navigate([`/book`, bookId]);

  }

  logout() {
    this.auth.logout();
  }

}
