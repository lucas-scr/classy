import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharPagamentosComponent } from './detalhar-pagamentos.component';

describe('DetalharPagamentosComponent', () => {
  let component: DetalharPagamentosComponent;
  let fixture: ComponentFixture<DetalharPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharPagamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
