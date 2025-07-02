import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPagamentosComponent } from './cadastrar-pagamentos.component';

describe('CadastrarPagamentosComponent', () => {
  let component: CadastrarPagamentosComponent;
  let fixture: ComponentFixture<CadastrarPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPagamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
