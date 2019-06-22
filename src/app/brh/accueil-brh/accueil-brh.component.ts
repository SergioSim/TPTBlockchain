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
    // this.nodeApi.getAllAccountsFromOpenchain().subscribe(
    //   res => {
    //     console.log('OK');
    //     console.log(res);
    //   }, err => {
    //     console.log('KO');
    //     console.log(err);
    //   }
    // );
    // this.nodeApi.getRecord('XoKzFaNq6K3vc63akCwLopagaTzsZ3t9HW').subscribe(
    //   res => {
    //     console.log('OK');
    //     console.log(res);
    //   }, err => {
    //     console.log('KO');
    //     console.log(err);
    //   }
    // );
  }
}

// //TEST NODEAPI
// this.nodeApi.login('brh@haiti.ht', 'aPassword').subscribe(
//   res => {
//     console.log(res);
//     this.nodeApi.makeRequest(apiUrl.deleteBank, {name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}).subscribe(
//       res2 => {
//         console.log('delete request: ');
//         console.log(res2);
//       }, error2 => {
//         console.log('delete error: ');
//         console.log(error2);
//       });
//   }, error => {
//     console.log('got an login error');
//     console.log(error);
//   });
// Get list of banks
// this.nodeApi.makeRequest(apiUrl.allBanks, {}).subscribe(
//   res =>{
//     console.log("got result ");
//     console.log(res);
//   }, error => {
//     console.log("got an error"); console.log(error)
//   });
// this.nodeApi.makeRequest(apiUrl.allClients, {}).subscribe(
//   res => {
//     console.log('got result ' + res);
//   }, error => {
//     console.log('got an error'); console.log(error)
//   });
// ISSUE 500 DHTG
// this.nodeApi.makeRequest(apiUrl.issueDHTG, {password: "aPassword", montant:500}).subscribe(
//   res => {
//     console.log('got result ' + res);
//     //TRANSFERT 50 DHTG to bankold@test.test
//     this.nodeApi.makeRequest(apiUrl.submit, {email:"bankold@test.test", password:"aPassword", montant:50, memo:"merci"}).subscribe(
//       res => {
//         console.log('got result ' + res);
//       }, error => {
//         console.log('got an error'); console.log(error)
//       });
//   }, error => {
//     console.log('got an error'); console.log(error)
//   });
// this.nodeApi.makeRequest(apiUrl.updateClient, {nom: "LaBRH", prenom:"delaBRH"}).subscribe(res =>{
//   console.log('got result ' + res);
//   }, error => {
//     console.log('got an error'); console.log(error)
//   });
