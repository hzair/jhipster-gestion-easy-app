import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISortie } from '../sortie.model';
import { SortieService } from '../service/sortie.service';
import { SortieDeleteDialogComponent } from '../delete/sortie-delete-dialog.component';

@Component({
  selector: 'jhi-sortie',
  templateUrl: './sortie.component.html',
})
export class SortieComponent implements OnInit {
  sorties?: ISortie[];
  isLoading = false;

  constructor(protected sortieService: SortieService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sortieService.query().subscribe({
      next: (res: HttpResponse<ISortie[]>) => {
        this.isLoading = false;
        this.sorties = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISortie): number {
    return item.id!;
  }

  delete(sortie: ISortie): void {
    const modalRef = this.modalService.open(SortieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sortie = sortie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
