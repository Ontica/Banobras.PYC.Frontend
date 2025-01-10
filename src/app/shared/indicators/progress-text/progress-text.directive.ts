/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, OnChanges, Input, OnDestroy } from '@angular/core';

import { interval, Subscription, tap } from 'rxjs';


@Directive({
  selector: '[empNgProgressText]'
})
export class ProgressTextDirective implements OnChanges, OnDestroy {

  @Input() isLoading: boolean;

  @Input() loadingText = '';

  @Input() finalText = '';

  private originalInnerText: string = null;

  private subscription: Subscription;


  constructor(private el: ElementRef) { }


  ngOnChanges() {
    if (!this.originalInnerText) {
      this.originalInnerText = this.el.nativeElement.innerText;
    }
    this.showProgressLabel();
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  private showProgressLabel() {
    if (this.isLoading) {
      this.setEllipsis(this.loadingText || 'Cargando');
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.el.nativeElement.innerText = this.finalText || this.originalInnerText || 'Finalizado';
    }
  }


  private setEllipsis(text: string) {
    this.el.nativeElement.innerText = text + '.';

    let count = 0;
    this.subscription = interval(200).pipe(
      tap(() => {
        count = (++count % 6);
        this.el.nativeElement.innerText = text + ' .'.repeat(count);
      })).subscribe();
  }

}
