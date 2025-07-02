import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharContratosComponent } from './detalhar-contratos.component';

describe('DetalharContratosComponent', () => {
  let component: DetalharContratosComponent;
  let fixture: ComponentFixture<DetalharContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
