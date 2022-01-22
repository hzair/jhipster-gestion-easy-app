import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJob, Job } from '../job.model';
import { JobService } from '../service/job.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IEmployee2 } from 'app/entities/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/employee-2/service/employee-2.service';

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;

  tasksSharedCollection: ITask[] = [];
  employee2sSharedCollection: IEmployee2[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    minSalary: [],
    maxSalary: [],
    tasks: [],
    employee: [],
  });

  constructor(
    protected jobService: JobService,
    protected taskService: TaskService,
    protected employee2Service: Employee2Service,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  trackTaskById(index: number, item: ITask): number {
    return item.id!;
  }

  trackEmployee2ById(index: number, item: IEmployee2): number {
    return item.id!;
  }

  getSelectedTask(option: ITask, selectedVals?: ITask[]): ITask {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(job: IJob): void {
    this.editForm.patchValue({
      id: job.id,
      jobTitle: job.jobTitle,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      tasks: job.tasks,
      employee: job.employee,
    });

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing(this.tasksSharedCollection, ...(job.tasks ?? []));
    this.employee2sSharedCollection = this.employee2Service.addEmployee2ToCollectionIfMissing(
      this.employee2sSharedCollection,
      job.employee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing(tasks, ...(this.editForm.get('tasks')!.value ?? []))))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.employee2Service
      .query()
      .pipe(map((res: HttpResponse<IEmployee2[]>) => res.body ?? []))
      .pipe(
        map((employee2s: IEmployee2[]) =>
          this.employee2Service.addEmployee2ToCollectionIfMissing(employee2s, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employee2s: IEmployee2[]) => (this.employee2sSharedCollection = employee2s));
  }

  protected createFromForm(): IJob {
    return {
      ...new Job(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      minSalary: this.editForm.get(['minSalary'])!.value,
      maxSalary: this.editForm.get(['maxSalary'])!.value,
      tasks: this.editForm.get(['tasks'])!.value,
      employee: this.editForm.get(['employee'])!.value,
    };
  }
}
