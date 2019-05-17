


import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-banque-list',
  templateUrl: './banque-list.component.html',
  styleUrls: ['./banque-list.component.css']
})
export class BanqueListComponent implements OnInit {
  @Input() dataSource: string;
  displayedColumns: string[];

  constructor(
  ) { }

  ngOnInit() {
    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
  }

}


