import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProduit, Produit } from '../produit.model';
import { ProduitService } from '../service/produit.service';

@Component({
  selector: 'jhi-produit-update',
  templateUrl: './produit-update.component.html',
})
export class ProduitUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idFonc: [],
    idFournisseur: [],
    nom: [],
    description: [],
    quantite: [],
    image: [],
    dateExpiration: [],
  });

  constructor(protected produitService: ProduitService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produit }) => {
      if (produit.id === undefined) {
        const today = dayjs().startOf('day');
        produit.dateExpiration = today;
      }

      this.updateForm(produit);
    });
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
      idFournisseur: produit.idFournisseur,
      nom: produit.nom,
      description: produit.description,
      quantite: produit.quantite,
      image: produit.image,
      dateExpiration: produit.dateExpiration ? produit.dateExpiration.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IProduit {
    return {
      ...new Produit(),
      id: this.editForm.get(['id'])!.value,
      idFonc: this.editForm.get(['idFonc'])!.value,
      idFournisseur: this.editForm.get(['idFournisseur'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      quantite: this.editForm.get(['quantite'])!.value,
      image: this.editForm.get(['image'])!.value,
      dateExpiration: this.editForm.get(['dateExpiration'])!.value
        ? dayjs(this.editForm.get(['dateExpiration'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
