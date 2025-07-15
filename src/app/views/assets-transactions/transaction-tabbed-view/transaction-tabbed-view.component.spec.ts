/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionTabbedViewComponent } from './transaction-tabbed-view.component';

describe('AssetsTransactionTabbedViewComponent', () => {
  let component: AssetsTransactionTabbedViewComponent;
  let fixture: ComponentFixture<AssetsTransactionTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionTabbedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
