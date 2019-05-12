import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService, apiUrl } from './../../nodeapi.service';

@Component({
  selector: 'app-accueil-brh',
  templateUrl: './accueil-brh.component.html',
  styleUrls: ['./accueil-brh.component.css']
})
export class AccueilBrhComponent implements OnInit {
  faCircle = faCircle;
  constructor(private titleService: Title, private nodeApi: NodeapiService) { }

  ngOnInit() {
    //TEST NODEAPI
    this.titleService.setTitle('Accueil - Banque de la république d\'Haïti');
    this.nodeApi.login("brh@haiti.ht", "aPassword").subscribe(res =>{
      this.nodeApi.makeRequest(apiUrl.allClients, {}).subscribe(res =>{
        console.log("got result " + res)}, error => {
          console.log("got an error"); console.log(error)
        });
      //ISSUE 500 DHTG
      this.nodeApi.makeRequest(apiUrl.issueDHTG, {password: "aPassword", montant:500}).subscribe(res =>{
        console.log("got result " + res);
        //TRANSFERT 50 DHTG to bankold@test.test
        this.nodeApi.makeRequest(apiUrl.submit, {email:"bankold@test.test", password:"aPassword", montant:50, memo:"merci"}).subscribe(res =>{
          console.log("got result " + res)}, error => {
            console.log("got an error"); console.log(error)
          });
        }, error => {
          console.log("got an error"); console.log(error)
        });

      this.nodeApi.makeRequest(apiUrl.updateClient, {nom: "LaBRH", prenom:"delaBRH"}).subscribe(res =>{
        console.log("got result " + res)}, error => {
          console.log("got an error"); console.log(error)
        });
      }, error => { console.log("got an login error"); console.log(error)});
  }

}
