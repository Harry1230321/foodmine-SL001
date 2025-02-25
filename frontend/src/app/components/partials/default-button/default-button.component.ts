import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'default-button',
  standalone: false,
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.css'
})
export class DefaultButtonComponent implements OnInit {
  
  @Input()
  type: 'submit' | 'button' = 'submit';
  @Input()
  text:string = 'Submit';
  @Input()
  bgColor = ' #e72929';
  @Input()
  color = 'white';
  @Input()
  fontSizeRem = 1.3;
  @Input()
  widthRem = 12;
  @Output()
  onClick = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
