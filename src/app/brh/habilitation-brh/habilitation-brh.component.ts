import { Component, OnInit, ViewChild } from '@angular/core';
import { apiUrl, NodeapiService } from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-habilitation-brh',
  templateUrl: './habilitation-brh.component.html',
  styleUrls: ['./habilitation-brh.component.css']
})
export class HabilitationBrhComponent implements OnInit {
  data: MatTableDataSource<Banque>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listBanqueValid: any[];
  displayedColumns: any[];
  taille: number;
  contactDialogRef: any;


  constructor(
    private service: NodeapiService,
    private dialog: MatDialog,

  ) { }


  ngOnInit() {
    this.refreshListBanqueValid();
    this.displayedColumns = ['Nom', 'Email', 'Telephone', 'Portefeuille', 'Statut','Document'];
    this.taille = 23;
  }
  downloadPI() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('pièce_identité.pdf');
  }
  downloadJD() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('justificatif_de_domicil.pdf');
  }
  downloadAL() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('annonce_legale.pdf');
  }
  openDownloadDialog(templateRef) {
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '250px' });
  }
  refreshListBanqueValid() {
    this.service.makeRequest(apiUrl.allBanksValid, {}).
      subscribe(res => {
        this.listBanqueValid = res as Banque[];
        this.data = new MatTableDataSource(this.listBanqueValid);
        this.data.paginator = this.paginator;
      }
      );

  }
  cancelValidatBanque() {
    this.contactDialogRef.close();
  }

}

