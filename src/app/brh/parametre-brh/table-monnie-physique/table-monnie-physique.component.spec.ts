import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMonniePhysiqueComponent } from './table-monnie-physique.component';

describe('TableMonniePhysiqueComponent', () => {
  let component: TableMonniePhysiqueComponent;
  let fixture: ComponentFixture<TableMonniePhysiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMonniePhysiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMonniePhysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
