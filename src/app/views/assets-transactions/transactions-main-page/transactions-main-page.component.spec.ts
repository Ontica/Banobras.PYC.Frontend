/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransactionsMainPageComponent } from './transactions-main-page.component';

describe('AssetTransactionsMainPageComponent', () => {
  let component: AssetTransactionsMainPageComponent;
  let fixture: ComponentFixture<AssetTransactionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetTransactionsMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransactionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
