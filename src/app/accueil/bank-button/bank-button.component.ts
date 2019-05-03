import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { Url } from 'url';

@Component({
  selector: 'app-bank-button',
  templateUrl: './bank-button.component.html',
  styleUrls: ['./bank-button.component.css']
})
export class BankButtonComponent implements OnInit {
  @Input() name: string;
  @Input() image: string;
  @Input() url: string;

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'height', '100%');
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
