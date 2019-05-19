import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { NgForm, FormControl } from '@angular/forms';
@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.css']
})
export class BanqueComponent implements OnInit {

  NomBanque = new FormControl('');
  Email = new FormControl('');
  MotDePasse = new FormControl('');
  Mobile = new FormControl('');

  constructor(public service: NodeapiService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('on submit called!!!');
    if (this.NomBanque.valid) {
      this.service.makeRequest(apiUrl.createBank, {name: this.NomBanque.value}).subscribe(
        res =>{
        console.log('on a recu la response:' );
        console.log(res);
      }, error => {
          console.log('got an error');
          console.log(error);
      });
    }
  }
}
