import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IImputation, Imputation } from '../imputation.model';
import { ImputationService } from '../service/imputation.service';

@Component({
  selector: 'jhi-imputation-update',
  templateUrl: './imputation-update.component.html',
})
export class ImputationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    date: [],
  });

  constructor(protected imputationService: ImputationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ imputation }) => {
      if (imputation.id === undefined) {
        const today = dayjs().startOf('day');
        imputation.date = today;
      }

      this.updateForm(imputation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const imputation = this.createFromForm();
    if (imputation.id !== undefined) {
      this.subscribeToSaveResponse(this.imputationService.update(imputation));
    } else {
      this.subscribeToSaveResponse(this.imputationService.create(imputation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImputation>>): void {
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

  protected updateForm(imputation: IImputation): void {
    this.editForm.patchValue({
      id: imputation.id,
      date: imputation.date ? imputation.date.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IImputation {
    return {
      ...new Imputation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
