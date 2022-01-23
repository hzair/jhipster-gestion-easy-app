import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICamion, Camion } from '../camion.model';

import { CamionService } from './camion.service';

describe('Camion Service', () => {
  let service: CamionService;
  let httpMock: HttpTestingController;
  let elemDefault: ICamion;
  let expectedResult: ICamion | ICamion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CamionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
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

    it('should create a Camion', () => {
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

      service.create(new Camion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Camion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a Camion', () => {
      const patchObject = Object.assign({}, new Camion());

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

    it('should return a list of Camion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a Camion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCamionToCollectionIfMissing', () => {
      it('should add a Camion to an empty array', () => {
        const camion: ICamion = { id: 123 };
        expectedResult = service.addCamionToCollectionIfMissing([], camion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(camion);
      });

      it('should not add a Camion to an array that contains it', () => {
        const camion: ICamion = { id: 123 };
        const camionCollection: ICamion[] = [
          {
            ...camion,
          },
          { id: 456 },
        ];
        expectedResult = service.addCamionToCollectionIfMissing(camionCollection, camion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Camion to an array that doesn't contain it", () => {
        const camion: ICamion = { id: 123 };
        const camionCollection: ICamion[] = [{ id: 456 }];
        expectedResult = service.addCamionToCollectionIfMissing(camionCollection, camion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(camion);
      });

      it('should add only unique Camion to an array', () => {
        const camionArray: ICamion[] = [{ id: 123 }, { id: 456 }, { id: 47363 }];
        const camionCollection: ICamion[] = [{ id: 123 }];
        expectedResult = service.addCamionToCollectionIfMissing(camionCollection, ...camionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const camion: ICamion = { id: 123 };
        const camion2: ICamion = { id: 456 };
        expectedResult = service.addCamionToCollectionIfMissing([], camion, camion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(camion);
        expect(expectedResult).toContain(camion2);
      });

      it('should accept null and undefined values', () => {
        const camion: ICamion = { id: 123 };
        expectedResult = service.addCamionToCollectionIfMissing([], null, camion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(camion);
      });

      it('should return initial array if no Camion is added', () => {
        const camionCollection: ICamion[] = [{ id: 123 }];
        expectedResult = service.addCamionToCollectionIfMissing(camionCollection, undefined, null);
        expect(expectedResult).toEqual(camionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
