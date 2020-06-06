import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  // Todo: make sure we receive this value from the parent component
  @Input() numberOfPages: number;
  @Input() currentPage: number;
  @Output() changeCurrentPage = new EventEmitter<number>();
  showPageOffset = -2;

  pageOptions: number[];

  constructor() { }

  ngOnInit(): void {
    if (this.currentPage <= 2) {
      this.showPageOffset -= this.currentPage - 3;
    } else if (this.currentPage >= this.numberOfPages - 1) {
      this.showPageOffset += this.currentPage - this.numberOfPages;
    }

    this.pageOptions = [...Array(5)].map((_, i) => i + this.showPageOffset + this.currentPage)
      .filter(pageNumber => pageNumber >= 1 && pageNumber <= this.numberOfPages);
  }

  onClick(item: number) {
    this.changeCurrentPage.emit(item);
  }
}
