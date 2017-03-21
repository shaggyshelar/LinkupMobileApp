import { Component, Input } from '@angular/core';

@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeaderComponent {

  text: string;

  constructor() {
    console.log('Hello ExpandableHeader Component');
    this.text = 'Hello World';
  }

}
