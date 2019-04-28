import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'height', '100%');
   }

  ngOnInit() {
    document.querySelector("#Group_334").addEventListener("click", () => location.href = "banqueCentrale");
    document.querySelector("#Banque_Centrale").addEventListener("click", () => location.href = "banqueCentrale");
    document.querySelector("#Group_334-2").addEventListener("click", () => location.href = "banqueCommerciale");
    document.querySelector("#Banque_Commerciale").addEventListener("click", () => location.href = "banqueCommerciale");
    document.querySelector("#Group_334-3").addEventListener("click", () => location.href = "commercant");
    document.querySelector("#Commercant").addEventListener("click", () => location.href = "commercant");
    document.querySelector("#Group_334-4").addEventListener("click", () => location.href = "particulier");
    document.querySelector("#Particulier").addEventListener("click", () => location.href = "particulier");
  }

}
