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
  dataSource: [];
  formData : Banque;
  list : Banque [];
  displayedColumns: string[];
  ngOnInit() {
    this.refreshListBanque();
    this.displayedColumns = ['Name','Supprimer','Editer','Permission'];

  }
  refreshListBanque(){
     this.service.makeRequest(apiUrl.allBanks, {}).toPromise().then(res=>this.list = res as Banque[])
    /*  subscribe(res =>{
          console.log("got result " );
          console.log(res);
        }, error => {
            console.log("got an error"); console.log(error)
          });  */
  }
     onDelete(nom: String){
       this.service.makeRequest(apiUrl.deleteBank,{name: nom}).subscribe(res =>{
        console.log("got result " );
        console.log(res);

      }, error => {
          console.log("got an error"); console.log(error)
        });  
     }
}
