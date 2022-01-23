import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CamionService } from '../service/camion.service';

import { CamionComponent } from './camion.component';

describe('Camion Management Component', () => {
  let comp: CamionComponent;
  let fixture: ComponentFixture<CamionComponent>;
  let service: CamionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CamionComponent],
    })
      .overrideTemplate(CamionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CamionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CamionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.camions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
