import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISortie, Sortie } from '../sortie.model';
import { SortieService } from '../service/sortie.service';
import { ICamion } from 'app/entities/camion/camion.model';
import { CamionService } from 'app/entities/camion/service/camion.service';

@Component({
  selector: 'jhi-sortie-update',
  templateUrl: './sortie-update.component.html',
})
export class SortieUpdateComponent implements OnInit {
  isSaving = false;

  camionsSharedCollection: ICamion[] = [];

  editForm = this.fb.group({
    id: [],
    quantite: [],
    date: [],
    camion: [],
  });

  constructor(
    protected sortieService: SortieService,
    protected camionService: CamionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sortie }) => {
      if (sortie.id === undefined) {
        const today = dayjs().startOf('day');
        sortie.date = today;
      }

      this.updateForm(sortie);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sortie = this.createFromForm();
    if (sortie.id !== undefined) {
      this.subscribeToSaveResponse(this.sortieService.update(sortie));
    } else {
      this.subscribeToSaveResponse(this.sortieService.create(sortie));
    }
  }

  trackCamionById(index: number, item: ICamion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISortie>>): void {
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

  protected updateForm(sortie: ISortie): void {
    this.editForm.patchValue({
      id: sortie.id,
      quantite: sortie.quantite,
      date: sortie.date ? sortie.date.format(DATE_TIME_FORMAT) : null,
      camion: sortie.camion,
    });

    this.camionsSharedCollection = this.camionService.addCamionToCollectionIfMissing(this.camionsSharedCollection, sortie.camion);
  }

  protected loadRelationshipsOptions(): void {
    this.camionService
      .query()
      .pipe(map((res: HttpResponse<ICamion[]>) => res.body ?? []))
      .pipe(map((camions: ICamion[]) => this.camionService.addCamionToCollectionIfMissing(camions, this.editForm.get('camion')!.value)))
      .subscribe((camions: ICamion[]) => (this.camionsSharedCollection = camions));
  }

  protected createFromForm(): ISortie {
    return {
      ...new Sortie(),
      id: this.editForm.get(['id'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      camion: this.editForm.get(['camion'])!.value,
    };
  }
}
