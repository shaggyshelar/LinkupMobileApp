import { Component, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeaderComponent {
  @Input('scrollHeader') scrollArea: any;
  headerHeight: any;
  newHeaderHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer) {
    this.headerHeight = 10;
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
  }

  ngAfterViewInit() {
    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev) {
    ev.domWrite(() => {
      //console.log(ev.scrollTop);
      this.newHeaderHeight = this.headerHeight - ev.scrollTop;
      //console.log('New=' + this.newHeaderHeight + ', top=' + ev.scrollTop);
      if (this.newHeaderHeight < 0) {
        this.newHeaderHeight = 0;
        //this.renderer.setElementStyle(this.element.nativeElement, 'margin-top', this.newHeaderHeight + 'px');
      }
      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
    });
  }

}
