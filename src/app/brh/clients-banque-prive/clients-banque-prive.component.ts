import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-clients-banque-prive',
  templateUrl: './clients-banque-prive.component.html',
  styleUrls: ['./clients-banque-prive.component.css']
})
export class ClientsBanquePriveComponent implements OnInit {

  dataSource: any;
  displayedColumns = ["Email", "Address", "Nom", "Prenom"];

  constructor(private apiService: NodeapiService) { }

  ngOnInit() {
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        this.dataSource = res;
      }, err => {
        console.log('err : ');
        console.log(err);
      }
    );
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

}
