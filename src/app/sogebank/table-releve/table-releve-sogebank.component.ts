import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-table-releve-sogebank',
  templateUrl: './table-releve-sogebank.component.html',
  styleUrls: ['./table-releve-sogebank.component.css']
})
export class TableReleveSogebankComponent implements OnInit {
  @Input() dataSource: string;
  displayedColumns: string[];
  faDownload = faDownload;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
  }

}


