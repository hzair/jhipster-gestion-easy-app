import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CreditService } from '../service/credit.service';

import { CreditComponent } from './credit.component';

describe('Credit Management Component', () => {
  let comp: CreditComponent;
  let fixture: ComponentFixture<CreditComponent>;
  let service: CreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CreditComponent],
    })
      .overrideTemplate(CreditComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CreditService);

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
    expect(comp.credits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
