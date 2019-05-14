import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevesParticulierComponent } from './releves-particulier.component';

describe('RelevesParticulierComponent', () => {
  let component: RelevesParticulierComponent;
  let fixture: ComponentFixture<RelevesParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelevesParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevesParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
