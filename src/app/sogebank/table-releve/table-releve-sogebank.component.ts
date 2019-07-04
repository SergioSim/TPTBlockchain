import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Role } from '../Role';
import { NodeapiService } from 'src/app/nodeapi.service';
declare let jsPDF;

@Component({
  selector: 'app-table-releve-sogebank',
  templateUrl: './table-releve-sogebank.component.html',
  styleUrls: ['./table-releve-sogebank.component.css']
})
export class TableReleveSogebankComponent implements OnInit {
  @Input() dataSource: string;
  displayedColumns: string[];
  faDownload = faDownload;
  faPrint = faPrint;
  roles = Role;

  constructor(
    public apiService: NodeapiService,
    public sogebankService: SogebankService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setColumnsToDisplay();
  }

  setColumnsToDisplay() {
    this.displayedColumns = this.apiService.permission === Role.COMMERCANT
      ? ['id', 'date', 'type', 'expediteur', 'montant', 'destinataire', 'motif', 'recu']
      : ['id', 'date', 'type', 'expediteur', 'montant', 'destinataire', 'motif'];
  }

  formatColumnContent(content) {
    if (content && content.length > 16) {
      return content.substring(0, 14) + '...';
    }
    return content;
  }

  print() {
    let isCommercant = false;

    if (this.apiService.permission === Role.COMMERCANT) {
      isCommercant = true;
      this.apiService.permission = Role.PARTICULIER;
      this.setColumnsToDisplay();
    }

    this.cdr.detectChanges();

    const printPopup = window.open('');
    const tableToPrint = document.getElementById('releve-table');
    let htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding:0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += tableToPrint.outerHTML;
    printPopup.document.write(htmlToPrint);
    printPopup.print();
    printPopup.close();

    if (isCommercant) {
      this.apiService.permission = Role.COMMERCANT;
      this.setColumnsToDisplay();
    }
  }

  downloadReceipt(transaction) {
    console.log(transaction);
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a6',
      putOnlyUsedFonts: true
     });
    const img = new Image();
    img.src = 'assets/logos/sogebank_logo.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 20, 10, 65, 15);
      doc.line(30, 30, 75, 30);
      doc.text('Reçu de paiement', 30, 40);
      doc.setFontSize(10);
      doc.text(this.apiService.fullname, 10, 50);
      doc.text('SIRET: ' + this.apiService.siret, 10, 55);
      doc.text('Tél: ' + this.apiService.tel, 10, 60);
      doc.text(this.apiService.adresse, 10, 65);
      doc.text(this.apiService.ville, 10, 70);
      doc.text(this.apiService.codePostal, 10, 75);
      doc.line(30, 80, 75, 80);
      doc.setFontSize(16);
      doc.text('Informations sur la transaction :', 15, 90);
      doc.setFontSize(10);
      doc.text('Date : ' + transaction.date, 10, 100);
      doc.text('Montant : ' + transaction.montant.slice(1), 10, 105);
      doc.text('ID : ' + transaction.id.substring(transaction.id.length / 2), 10, 110);
      doc.text('     ' + transaction.id.substring(0, transaction.id.length / 2), 10, 115);
      doc.save('recu_' + transaction.id + '.pdf');
    };
  }

  download() {
    let isCommercant = false;

    if (this.apiService.permission === Role.COMMERCANT) {
      isCommercant = true;
      this.apiService.permission = Role.PARTICULIER;
      this.setColumnsToDisplay();
    }

    this.cdr.detectChanges();

    const doc = new jsPDF();
    doc.autoTable({html: '#releve-table'});
    doc.save('releve.pdf');

    if (isCommercant) {
      this.apiService.permission = Role.COMMERCANT;
      this.setColumnsToDisplay();
    }
  }

}


