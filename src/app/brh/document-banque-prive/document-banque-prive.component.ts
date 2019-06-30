import { Component, OnInit, Input } from '@angular/core';
import { BanqueClient } from '../clients-banque-prive/clients-banque-prive.component';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-document-banque-prive',
  templateUrl: './document-banque-prive.component.html',
  styleUrls: ['./document-banque-prive.component.css']
})
export class DocumentBanquePriveComponent implements OnInit {

  public client: BanqueClient;
  public showDocs = false;
  public docs: ClientDocument;
  public numberOfDocs = 0;
  public isNotNull = [false, false, false];

  @Input() set setClient(aClient: BanqueClient) {
    this.client = aClient;
    this.getClientDocs();
  }

  constructor(
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  getClientDocs() {
    this.apiService.makeRequest(apiUrl.clientDocuments, {email: this.client.Email}).subscribe(
      res => {
        if (res.length > 0) {
          this.docs = res[0] as ClientDocument;
          console.log('GOT DOCUMENTS', this.docs);
          console.log('GOT DOCUMENTS', typeof this.docs.Annonce_Legale);
          this.isNotNull = [(this.docs.Piece_Identite        !== null),
                            (this.docs.Justificatif_Domicile !== null),
                            (this.docs.Annonce_Legale !== null)];
          console.log('isNotNull', this.isNotNull);
          this.numberOfDocs = this.isNotNull.filter( v => v).length;
        }
        this.showDocs = true;
      }, err => {
        console.log('ERROR on Document request!', err);
        this.showDocs = false;
      });
  }

  consult(buf: Buffer) {
    if (buf !== null) {
      console.log('Selected Buffer:', buf);
    } else {
      this.snackBar.open('Document non remplie!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
    }
  }

}

export interface ClientDocument {
  Email: string;
  Piece_Identite: {type: string, data: Buffer};
  Justificatif_Domicile: {type: string, data: Buffer};
  Annonce_Legale: {type: string, data: Buffer};

}
