import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NodeapiService ,apiUrl} from 'src/app/nodeapi.service';


@Component({
  selector: 'app-table-monnie-electronique',
  templateUrl: './table-monnie-electronique.component.html',
  styleUrls: ['./table-monnie-electronique.component.css']
})
export class TableMonnieElectroniqueComponent implements OnInit {
    
    contactDialogRef: any;
    p:number=1;
    q:number=1;
    selectedPortefeuille: {
      id: '',
      Nom: '',
      Portefeuille: '',
      MaxTransaction: '',
      MaxTransactionMoi: '',
      Status:''
    };

  constructor( 
    private service :NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ){ }

    listMonnieVisible : any [];
    displayedColumns :any[];


  ngOnInit() {
    this.getMonnieVisible();
    this.displayedColumns = ['DHTG','DHTGUnite','Nom','Unite','Supprimer'];
  }

  getMonnieVisible(){
    this.service.makeRequest(apiUrl.allMonnies , {type:"electronique"}).toPromise().then(res=>this.listMonnieVisible = res as Monnie[] );
  }

}  
  export interface Monnie {
    Nom: string;
    Unite: string;
    Type: number;
  }
  