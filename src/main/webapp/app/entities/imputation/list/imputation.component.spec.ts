import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ImputationService } from '../service/imputation.service';

import { ImputationComponent } from './imputation.component';

describe('Imputation Management Component', () => {
  let comp: ImputationComponent;
  let fixture: ComponentFixture<ImputationComponent>;
  let service: ImputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ImputationComponent],
    })
      .overrideTemplate(ImputationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImputationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ImputationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
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
    expect(comp.imputations?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
