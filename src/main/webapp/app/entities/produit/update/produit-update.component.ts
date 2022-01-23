import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProduit, Produit } from '../produit.model';
import { ProduitService } from '../service/produit.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IFournisseur } from 'app/entities/fournisseur/fournisseur.model';
import { FournisseurService } from 'app/entities/fournisseur/service/fournisseur.service';
import { ISortie } from 'app/entities/sortie/sortie.model';
import { SortieService } from 'app/entities/sortie/service/sortie.service';

@Component({
  selector: 'jhi-produit-update',
  templateUrl: './produit-update.component.html',
})
export class ProduitUpdateComponent implements OnInit {
  isSaving = false;

  fournisseursSharedCollection: IFournisseur[] = [];
  sortiesSharedCollection: ISortie[] = [];

  editForm = this.fb.group({
    id: [],
    idFonc: [],
    designation: [null, [Validators.required]],
    description: [],
    quantite: [null, [Validators.required]],
    prixAchat: [null, [Validators.required]],
    prixVente: [null, [Validators.required]],
    prixVenteGros: [],
    image: [],
    imageContentType: [],
    date: [],
    fournisseur: [],
    sortie: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected produitService: ProduitService,
    protected fournisseurService: FournisseurService,
    protected sortieService: SortieService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produit }) => {
      if (produit.id === undefined) {
        const today = dayjs().startOf('day');
        produit.date = today;
      }

      this.updateForm(produit);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gestionEasyApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produit = this.createFromForm();
    if (produit.id !== undefined) {
      this.subscribeToSaveResponse(this.produitService.update(produit));
    } else {
      this.subscribeToSaveResponse(this.produitService.create(produit));
    }
  }

  trackFournisseurById(index: number, item: IFournisseur): number {
    return item.id!;
  }

  trackSortieById(index: number, item: ISortie): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduit>>): void {
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

  protected updateForm(produit: IProduit): void {
    this.editForm.patchValue({
      id: produit.id,
      idFonc: produit.idFonc,
      designation: produit.designation,
      description: produit.description,
      quantite: produit.quantite,
      prixAchat: produit.prixAchat,
      prixVente: produit.prixVente,
      prixVenteGros: produit.prixVenteGros,
      image: produit.image,
      imageContentType: produit.imageContentType,
      date: produit.date ? produit.date.format(DATE_TIME_FORMAT) : null,
      fournisseur: produit.fournisseur,
      sortie: produit.sortie,
    });

    this.fournisseursSharedCollection = this.fournisseurService.addFournisseurToCollectionIfMissing(
      this.fournisseursSharedCollection,
      produit.fournisseur
    );
    this.sortiesSharedCollection = this.sortieService.addSortieToCollectionIfMissing(this.sortiesSharedCollection, produit.sortie);
  }

  protected loadRelationshipsOptions(): void {
    this.fournisseurService
      .query()
      .pipe(map((res: HttpResponse<IFournisseur[]>) => res.body ?? []))
      .pipe(
        map((fournisseurs: IFournisseur[]) =>
          this.fournisseurService.addFournisseurToCollectionIfMissing(fournisseurs, this.editForm.get('fournisseur')!.value)
        )
      )
      .subscribe((fournisseurs: IFournisseur[]) => (this.fournisseursSharedCollection = fournisseurs));

    this.sortieService
      .query()
      .pipe(map((res: HttpResponse<ISortie[]>) => res.body ?? []))
      .pipe(map((sorties: ISortie[]) => this.sortieService.addSortieToCollectionIfMissing(sorties, this.editForm.get('sortie')!.value)))
      .subscribe((sorties: ISortie[]) => (this.sortiesSharedCollection = sorties));
  }

  protected createFromForm(): IProduit {
    return {
      ...new Produit(),
      id: this.editForm.get(['id'])!.value,
      idFonc: this.editForm.get(['idFonc'])!.value,
      designation: this.editForm.get(['designation'])!.value,
      description: this.editForm.get(['description'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      prixAchat: this.editForm.get(['prixAchat'])!.value,
      prixVente: this.editForm.get(['prixVente'])!.value,
      prixVenteGros: this.editForm.get(['prixVenteGros'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      fournisseur: this.editForm.get(['fournisseur'])!.value,
      sortie: this.editForm.get(['sortie'])!.value,
    };
  }
}
