import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMateriasComponent } from './cadastro-materias.component';

describe('CadastroMateriasComponent', () => {
  let component: CadastroMateriasComponent;
  let fixture: ComponentFixture<CadastroMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
