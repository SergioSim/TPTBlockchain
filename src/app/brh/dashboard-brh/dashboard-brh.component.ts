import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService } from '../../nodeapi.service';
@Component({
  selector: 'app-dashboard-brh',
  templateUrl: './dashboard-brh.component.html',
  styleUrls: ['./dashboard-brh.component.css']
})
export class DashboardBrhComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any[];
  p:number=1;
  
  constructor(
    private service: NodeapiService,
  ) { }
  
  ngOnInit() {
    this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];
    this.dataSource = this.service.getListBanque();
  }                

}


