import { Component, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'expandable-footer',
  templateUrl: 'expandable-footer.html'
})
export class ExpandableFooterComponent {
  @Input('scrollFooter') scrollFooter: any;
  headerHeight: any;
  newFooterHeight: any;
  lastScrollTop: any;
  lastScrollDirection: any;
  startShowing: any;

  constructor(public element: ElementRef, public renderer: Renderer) {
    this.headerHeight = 65;
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
  }

  ngAfterViewInit() {
    this.scrollFooter.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev) {
    ev.domWrite(() => {
      console.log('DirY=' + ev.directionY + ',ScrollTop=' + ev.scrollTop + ',contentBottom=' + ev.contentBottom);
      if (this.lastScrollDirection == 'down' && ev.directionY == 'up') {
        this.startShowing = true;
      }
      if (ev.directionY == 'down') {
        this.lastScrollTop = ev.scrollTop;
        this.newFooterHeight = this.headerHeight - ev.scrollTop;
        if (this.newFooterHeight < 0) {
          this.newFooterHeight = 0;
        }
      }
      if (ev.directionY == 'up' && this.startShowing) {
        let newHeight = this.lastScrollTop - ev.scrollTop;
        if (newHeight < 56) {
          this.newFooterHeight = newHeight;
        }
      }

      this.lastScrollDirection = ev.directionY;
      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newFooterHeight + 'px');
    });
  }
}
