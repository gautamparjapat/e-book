import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Books } from '../../Books';

@Component({
  selector: 'app-book-reading',
  imports: [CommonModule],
  templateUrl: './book-reading.component.html',
  styleUrl: './book-reading.component.scss'
})
export class BookReadingComponent implements OnInit {

  bookId!: string;
  book: any;
  currentPage = 0;
  progress: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.book = Books.find(b => b.id === this.bookId);
  
    if (!this.book) {
      console.error('Book not found!');
      return;
    }
  
    const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    this.progress = savedProgress[this.bookId] || {};
  
    const readingPositions = JSON.parse(localStorage.getItem('readingPositions') || '{}');
    this.currentPage = readingPositions[this.bookId] || 0;
  }

  markLineAsRead(pageIndex: number, lineIndex: number): void {
    const key = `${pageIndex}-${lineIndex}`;
    this.progress[key] = true;

    const allProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    allProgress[this.bookId] = this.progress;
    localStorage.setItem('readingProgress', JSON.stringify(allProgress));
  }

  isLineRead(pageIndex: number, lineIndex: number): boolean {
    return this.progress[`${pageIndex}-${lineIndex}`] || false;
  }

  nextPage(): void {
    if (this.currentPage < this.book.content.length - 1) {
      this.currentPage++;
      this.saveCurrentPage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.saveCurrentPage();
    }
  }

  saveCurrentPage(): void {
    const readingPositions = JSON.parse(localStorage.getItem('readingPositions') || '{}');
    readingPositions[this.bookId] = this.currentPage;
    localStorage.setItem('readingPositions', JSON.stringify(readingPositions));
  }

}
