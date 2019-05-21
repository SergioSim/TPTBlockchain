import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { NgForm, FormControl } from '@angular/forms';
import { Banque } from 'src/app/banque.modele';

@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.css']
})
export class BanqueComponent implements OnInit {

  NomBanque = new FormControl('');
  Email = new FormControl('');
  Telephone = new FormControl('');

  constructor(public service: NodeapiService) {
  }
  formData : Banque;
  list : Banque [];
  ngOnInit() {
  }

  onSubmit() {
    console.log('on submit called!!!');
    if (this.NomBanque.valid) {
      this.service.makeRequest(apiUrl.createBank, {Nom: this.NomBanque.value,Email:this.Email.value,Tel: '878787877'}).subscribe(
        res =>{
        console.log('on a recu la response:' );
        console.log(res)
      }, error => {
          console.log('got an error');
          console.log(error);
      });
    }     
  }
}
