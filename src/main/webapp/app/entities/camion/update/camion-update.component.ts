import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICamion, Camion } from '../camion.model';
import { CamionService } from '../service/camion.service';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { VendeurService } from 'app/entities/vendeur/service/vendeur.service';

@Component({
  selector: 'jhi-camion-update',
  templateUrl: './camion-update.component.html',
})
export class CamionUpdateComponent implements OnInit {
  isSaving = false;

  vendeursCollection: IVendeur[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    vendeur: [],
  });

  constructor(
    protected camionService: CamionService,
    protected vendeurService: VendeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ camion }) => {
      if (camion.id === undefined) {
        const today = dayjs().startOf('day');
        camion.date = today;
      }

      this.updateForm(camion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const camion = this.createFromForm();
    if (camion.id !== undefined) {
      this.subscribeToSaveResponse(this.camionService.update(camion));
    } else {
      this.subscribeToSaveResponse(this.camionService.create(camion));
    }
  }

  trackVendeurById(index: number, item: IVendeur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICamion>>): void {
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

  protected updateForm(camion: ICamion): void {
    this.editForm.patchValue({
      id: camion.id,
      date: camion.date ? camion.date.format(DATE_TIME_FORMAT) : null,
      vendeur: camion.vendeur,
    });

    this.vendeursCollection = this.vendeurService.addVendeurToCollectionIfMissing(this.vendeursCollection, camion.vendeur);
  }

  protected loadRelationshipsOptions(): void {
    this.vendeurService
      .query({ filter: 'camion-is-null' })
      .pipe(map((res: HttpResponse<IVendeur[]>) => res.body ?? []))
      .pipe(
        map((vendeurs: IVendeur[]) => this.vendeurService.addVendeurToCollectionIfMissing(vendeurs, this.editForm.get('vendeur')!.value))
      )
      .subscribe((vendeurs: IVendeur[]) => (this.vendeursCollection = vendeurs));
  }

  protected createFromForm(): ICamion {
    return {
      ...new Camion(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      vendeur: this.editForm.get(['vendeur'])!.value,
    };
  }
}
