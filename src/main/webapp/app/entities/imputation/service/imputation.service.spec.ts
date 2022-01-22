import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IImputation, Imputation } from '../imputation.model';

import { ImputationService } from './imputation.service';

describe('Imputation Service', () => {
  let service: ImputationService;
  let httpMock: HttpTestingController;
  let elemDefault: IImputation;
  let expectedResult: IImputation | IImputation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ImputationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Imputation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Imputation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Imputation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Imputation', () => {
      const patchObject = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new Imputation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Imputation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Imputation', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addImputationToCollectionIfMissing', () => {
      it('should add a Imputation to an empty array', () => {
        const imputation: IImputation = { id: 'ABC' };
        expectedResult = service.addImputationToCollectionIfMissing([], imputation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(imputation);
      });

      it('should not add a Imputation to an array that contains it', () => {
        const imputation: IImputation = { id: 'ABC' };
        const imputationCollection: IImputation[] = [
          {
            ...imputation,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addImputationToCollectionIfMissing(imputationCollection, imputation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Imputation to an array that doesn't contain it", () => {
        const imputation: IImputation = { id: 'ABC' };
        const imputationCollection: IImputation[] = [{ id: 'CBA' }];
        expectedResult = service.addImputationToCollectionIfMissing(imputationCollection, imputation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(imputation);
      });

      it('should add only unique Imputation to an array', () => {
        const imputationArray: IImputation[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'afb20856-a7c6-43d2-ac52-a334bc6bd5dc' }];
        const imputationCollection: IImputation[] = [{ id: 'ABC' }];
        expectedResult = service.addImputationToCollectionIfMissing(imputationCollection, ...imputationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const imputation: IImputation = { id: 'ABC' };
        const imputation2: IImputation = { id: 'CBA' };
        expectedResult = service.addImputationToCollectionIfMissing([], imputation, imputation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(imputation);
        expect(expectedResult).toContain(imputation2);
      });

      it('should accept null and undefined values', () => {
        const imputation: IImputation = { id: 'ABC' };
        expectedResult = service.addImputationToCollectionIfMissing([], null, imputation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(imputation);
      });

      it('should return initial array if no Imputation is added', () => {
        const imputationCollection: IImputation[] = [{ id: 'ABC' }];
        expectedResult = service.addImputationToCollectionIfMissing(imputationCollection, undefined, null);
        expect(expectedResult).toEqual(imputationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
