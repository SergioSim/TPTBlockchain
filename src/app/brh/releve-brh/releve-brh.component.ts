import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { SogebankService } from 'src/app/sogebank/sogebank.service';
import { NodeapiService } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
@Component({
  selector: 'app-releve-brh',
  templateUrl: './releve-brh.component.html',
  styleUrls: ['./releve-brh.component.css']
})
export class ReleveBrhComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any[];
  faDownload = faDownload;
  faSyncAlt = faSyncAlt;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  constructor(
    public sogebankService: SogebankService,
    private titleService: Title,
    private  apiService: NodeapiService,
    private commonUtilsService:CommonUtilsService

  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');
    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
    this.dataSource = this.sogebankService.formatRecentTransactionData();
  }
}



