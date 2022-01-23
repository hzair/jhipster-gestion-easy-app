import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';
import { CreditDeleteDialogComponent } from '../delete/credit-delete-dialog.component';

@Component({
  selector: 'jhi-credit',
  templateUrl: './credit.component.html',
})
export class CreditComponent implements OnInit {
  credits?: ICredit[];
  isLoading = false;

  constructor(protected creditService: CreditService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.creditService.query().subscribe({
      next: (res: HttpResponse<ICredit[]>) => {
        this.isLoading = false;
        this.credits = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICredit): number {
    return item.id!;
  }

  delete(credit: ICredit): void {
    const modalRef = this.modalService.open(CreditDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.credit = credit;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
