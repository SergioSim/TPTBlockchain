import { Component, OnInit, Renderer2 } from '@angular/core';
import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  faCircle = faCircle;
  faPlay = faPlay;
  banks = [];
  brh = <any>{};

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'height', '100%');
    this.brh = {name: 'brh', image: 'assets/logos/brh_gradient_logo.jpeg', url: '/brh'};
    this.banks = [
      {name: 'sogebank', image: 'assets/logos/sogebank_logo.png', url: '/sogebank'},
      {name: 'scotiabank', image: 'assets/logos/scotiabank_logo.png', url: 'scotiabank.com'},
      {name: 'capital bank', image: 'assets/logos/capital_bank_logo.jpg', url: 'capital-bank.com'},
      {name: 'buh', image: 'assets/logos/buh_logo.png', url: 'buh.com'},
      {name: 'citibank', image: 'assets/logos/citibank_logo.png', url: 'citibank.com'},
      {name: 'unibank', image: 'assets/logos/unibank_logo.png', url: 'unibank.com'},
      {name: 'bph', image: 'assets/logos/bph_logo.jpeg', url: 'bph.com'},
      {name: 'bnc', image: 'assets/logos/bnc_logo.png', url: 'bnc.com'}
    ]
   }

  ngOnInit() {
    /*document.querySelector("#Group_334").addEventListener("click", () => location.href = "banqueCentrale");
    document.querySelector("#Banque_Centrale").addEventListener("click", () => location.href = "banqueCentrale");
    document.querySelector("#Group_334-2").addEventListener("click", () => location.href = "banqueCommerciale");
    document.querySelector("#Banque_Commerciale").addEventListener("click", () => location.href = "banqueCommerciale");
    document.querySelector("#Group_334-3").addEventListener("click", () => location.href = "commercant");
    document.querySelector("#Commercant").addEventListener("click", () => location.href = "commercant");
    document.querySelector("#Group_334-4").addEventListener("click", () => location.href = "particulier");
    document.querySelector("#Particulier").addEventListener("click", () => location.href = "particulier");*/
  }

}
