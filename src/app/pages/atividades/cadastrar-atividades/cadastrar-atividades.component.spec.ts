import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarAtividadesComponent } from './cadastrar-atividades.component';

describe('CadastrarAtividadesComponent', () => {
  let component: CadastrarAtividadesComponent;
  let fixture: ComponentFixture<CadastrarAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
