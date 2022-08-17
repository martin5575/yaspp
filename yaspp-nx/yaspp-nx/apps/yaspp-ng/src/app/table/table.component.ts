import { Component, Input, OnInit } from '@angular/core';
import { BlTableTeam } from '@yaspp-nx/open-liga-db';

@Component({
  selector: 'yaspp-nx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  constructor() {}

  @Input() table! : BlTableTeam[]

  ngOnInit(): void {}

  get loading() {
    return !this.table || this.table.length===0
  }
}
