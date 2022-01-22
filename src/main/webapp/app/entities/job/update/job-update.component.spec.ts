import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobService } from '../service/job.service';
import { IJob, Job } from '../job.model';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IEmployee2 } from 'app/entities/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/employee-2/service/employee-2.service';

import { JobUpdateComponent } from './job-update.component';

describe('Job Management Update Component', () => {
  let comp: JobUpdateComponent;
  let fixture: ComponentFixture<JobUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobService: JobService;
  let taskService: TaskService;
  let employee2Service: Employee2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(JobUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobService = TestBed.inject(JobService);
    taskService = TestBed.inject(TaskService);
    employee2Service = TestBed.inject(Employee2Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Task query and add missing value', () => {
      const job: IJob = { id: 456 };
      const tasks: ITask[] = [{ id: 92497 }];
      job.tasks = tasks;

      const taskCollection: ITask[] = [{ id: 18447 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [...tasks];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(taskCollection, ...additionalTasks);
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee2 query and add missing value', () => {
      const job: IJob = { id: 456 };
      const employee: IEmployee2 = { id: 159 };
      job.employee = employee;

      const employee2Collection: IEmployee2[] = [{ id: 78760 }];
      jest.spyOn(employee2Service, 'query').mockReturnValue(of(new HttpResponse({ body: employee2Collection })));
      const additionalEmployee2s = [employee];
      const expectedCollection: IEmployee2[] = [...additionalEmployee2s, ...employee2Collection];
      jest.spyOn(employee2Service, 'addEmployee2ToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(employee2Service.query).toHaveBeenCalled();
      expect(employee2Service.addEmployee2ToCollectionIfMissing).toHaveBeenCalledWith(employee2Collection, ...additionalEmployee2s);
      expect(comp.employee2sSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const job: IJob = { id: 456 };
      const tasks: ITask = { id: 88679 };
      job.tasks = [tasks];
      const employee: IEmployee2 = { id: 27898 };
      job.employee = employee;

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(job));
      expect(comp.tasksSharedCollection).toContain(tasks);
      expect(comp.employee2sSharedCollection).toContain(employee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = { id: 123 };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobService.update).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = new Job();
      jest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobService.create).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Job>>();
      const job = { id: 123 };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobService.update).toHaveBeenCalledWith(job);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTaskById', () => {
      it('Should return tracked Task primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTaskById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEmployee2ById', () => {
      it('Should return tracked Employee2 primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEmployee2ById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedTask', () => {
      it('Should return option if no Task is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedTask(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Task for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedTask(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Task is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedTask(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
