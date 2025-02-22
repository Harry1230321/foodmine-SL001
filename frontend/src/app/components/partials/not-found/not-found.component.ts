import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {
  
  @Input()
  visible= false;
  @Input()
  notFoundMessage = 'Page not found';
  @Input()
  resetLinkText='Reset';
  @Input()
  resetLinkRoute="/";
  constructor() { }

  ngOnInit(): void {
  }
}
