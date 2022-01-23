import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICredit, Credit } from '../credit.model';
import { CreditService } from '../service/credit.service';
import { IVendeur } from 'app/entities/vendeur/vendeur.model';
import { VendeurService } from 'app/entities/vendeur/service/vendeur.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

@Component({
  selector: 'jhi-credit-update',
  templateUrl: './credit-update.component.html',
})
export class CreditUpdateComponent implements OnInit {
  isSaving = false;

  vendeursCollection: IVendeur[] = [];
  clientsCollection: IClient[] = [];

  editForm = this.fb.group({
    id: [],
    montant: [],
    designation: [],
    date: [],
    vendeur: [],
    client: [],
  });

  constructor(
    protected creditService: CreditService,
    protected vendeurService: VendeurService,
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ credit }) => {
      if (credit.id === undefined) {
        const today = dayjs().startOf('day');
        credit.date = today;
      }

      this.updateForm(credit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const credit = this.createFromForm();
    if (credit.id !== undefined) {
      this.subscribeToSaveResponse(this.creditService.update(credit));
    } else {
      this.subscribeToSaveResponse(this.creditService.create(credit));
    }
  }

  trackVendeurById(index: number, item: IVendeur): number {
    return item.id!;
  }

  trackClientById(index: number, item: IClient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICredit>>): void {
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

  protected updateForm(credit: ICredit): void {
    this.editForm.patchValue({
      id: credit.id,
      montant: credit.montant,
      designation: credit.designation,
      date: credit.date ? credit.date.format(DATE_TIME_FORMAT) : null,
      vendeur: credit.vendeur,
      client: credit.client,
    });

    this.vendeursCollection = this.vendeurService.addVendeurToCollectionIfMissing(this.vendeursCollection, credit.vendeur);
    this.clientsCollection = this.clientService.addClientToCollectionIfMissing(this.clientsCollection, credit.client);
  }

  protected loadRelationshipsOptions(): void {
    this.vendeurService
      .query({ filter: 'credit-is-null' })
      .pipe(map((res: HttpResponse<IVendeur[]>) => res.body ?? []))
      .pipe(
        map((vendeurs: IVendeur[]) => this.vendeurService.addVendeurToCollectionIfMissing(vendeurs, this.editForm.get('vendeur')!.value))
      )
      .subscribe((vendeurs: IVendeur[]) => (this.vendeursCollection = vendeurs));

    this.clientService
      .query({ filter: 'credit-is-null' })
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsCollection = clients));
  }

  protected createFromForm(): ICredit {
    return {
      ...new Credit(),
      id: this.editForm.get(['id'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      designation: this.editForm.get(['designation'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      vendeur: this.editForm.get(['vendeur'])!.value,
      client: this.editForm.get(['client'])!.value,
    };
  }
}
