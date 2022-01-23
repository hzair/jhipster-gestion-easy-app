import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISortie, Sortie } from '../sortie.model';

import { SortieService } from './sortie.service';

describe('Sortie Service', () => {
  let service: SortieService;
  let httpMock: HttpTestingController;
  let elemDefault: ISortie;
  let expectedResult: ISortie | ISortie[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SortieService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      quantite: 0,
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

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Sortie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
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

      service.create(new Sortie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sortie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantite: 1,
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

    it('should partial update a Sortie', () => {
      const patchObject = Object.assign({}, new Sortie());

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

    it('should return a list of Sortie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantite: 1,
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

    it('should delete a Sortie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSortieToCollectionIfMissing', () => {
      it('should add a Sortie to an empty array', () => {
        const sortie: ISortie = { id: 123 };
        expectedResult = service.addSortieToCollectionIfMissing([], sortie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sortie);
      });

      it('should not add a Sortie to an array that contains it', () => {
        const sortie: ISortie = { id: 123 };
        const sortieCollection: ISortie[] = [
          {
            ...sortie,
          },
          { id: 456 },
        ];
        expectedResult = service.addSortieToCollectionIfMissing(sortieCollection, sortie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sortie to an array that doesn't contain it", () => {
        const sortie: ISortie = { id: 123 };
        const sortieCollection: ISortie[] = [{ id: 456 }];
        expectedResult = service.addSortieToCollectionIfMissing(sortieCollection, sortie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sortie);
      });

      it('should add only unique Sortie to an array', () => {
        const sortieArray: ISortie[] = [{ id: 123 }, { id: 456 }, { id: 18249 }];
        const sortieCollection: ISortie[] = [{ id: 123 }];
        expectedResult = service.addSortieToCollectionIfMissing(sortieCollection, ...sortieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sortie: ISortie = { id: 123 };
        const sortie2: ISortie = { id: 456 };
        expectedResult = service.addSortieToCollectionIfMissing([], sortie, sortie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sortie);
        expect(expectedResult).toContain(sortie2);
      });

      it('should accept null and undefined values', () => {
        const sortie: ISortie = { id: 123 };
        expectedResult = service.addSortieToCollectionIfMissing([], null, sortie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sortie);
      });

      it('should return initial array if no Sortie is added', () => {
        const sortieCollection: ISortie[] = [{ id: 123 }];
        expectedResult = service.addSortieToCollectionIfMissing(sortieCollection, undefined, null);
        expect(expectedResult).toEqual(sortieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
