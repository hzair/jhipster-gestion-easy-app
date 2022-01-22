import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployee2 } from '../employee-2.model';

@Component({
  selector: 'jhi-employee-2-detail',
  templateUrl: './employee-2-detail.component.html',
})
export class Employee2DetailComponent implements OnInit {
  employee2: IEmployee2 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee2 }) => {
      this.employee2 = employee2;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
