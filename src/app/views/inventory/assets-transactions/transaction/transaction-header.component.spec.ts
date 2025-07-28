/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTransactionHeaderComponent } from './transaction-header.component';

describe('AssetsTransactionHeaderComponent', () => {
  let component: AssetsTransactionHeaderComponent;
  let fixture: ComponentFixture<AssetsTransactionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsTransactionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTransactionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
