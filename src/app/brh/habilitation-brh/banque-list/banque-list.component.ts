import { Component, OnInit } from '@angular/core';
import { NodeapiService ,apiUrl} from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';

@Component({
  selector: 'app-banque-list',
  templateUrl: './banque-list.component.html',
  styleUrls: ['./banque-list.component.css']
})
export class BanqueListComponent implements OnInit {

  constructor(private service :NodeapiService) { }
  dataSource: any[];
  formData : Banque;
  list : Banque [];
  ngOnInit() {
     this.refreshListBanque();
     console.log(this.refreshListBanque());
  }
  refreshListBanque(){
  /*  return this.service.makeRequest(apiUrl.allBanks,"efi").toPromise()
    .then(res=>this.list = res as Banque[]); */
  }
}
