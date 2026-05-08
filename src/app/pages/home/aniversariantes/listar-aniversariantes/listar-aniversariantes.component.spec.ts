import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAniversariantesComponent } from './listar-aniversariantes.component';

describe('ListarAniversariantesComponent', () => {
  let component: ListarAniversariantesComponent;
  let fixture: ComponentFixture<ListarAniversariantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAniversariantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAniversariantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
