/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityProcessViewerComponent } from './entity-process-viewer.component';

describe('EntityProcessViewerComponent', () => {
  let component: EntityProcessViewerComponent;
  let fixture: ComponentFixture<EntityProcessViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityProcessViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityProcessViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
