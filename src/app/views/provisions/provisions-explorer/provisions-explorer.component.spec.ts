/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionsExplorerComponent } from './provisions-explorer.component';

describe('ProvisionsExplorerComponent', () => {
  let component: ProvisionsExplorerComponent;
  let fixture: ComponentFixture<ProvisionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvisionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvisionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
