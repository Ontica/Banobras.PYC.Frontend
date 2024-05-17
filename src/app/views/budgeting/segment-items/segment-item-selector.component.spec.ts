/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentItemSelectorComponent } from './segment-item-selector.component';

describe('SegmentItemSelectorComponent', () => {
  let component: SegmentItemSelectorComponent;
  let fixture: ComponentFixture<SegmentItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegmentItemSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
