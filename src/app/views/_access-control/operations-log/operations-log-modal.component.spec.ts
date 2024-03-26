import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsLogModalComponent } from './operations-log-modal.component';

describe('OperationsLogModalComponent', () => {
  let component: OperationsLogModalComponent;
  let fixture: ComponentFixture<OperationsLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsLogModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
