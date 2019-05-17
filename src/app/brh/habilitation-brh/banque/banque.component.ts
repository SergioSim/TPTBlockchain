import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.css']
})
export class BanqueComponent implements OnInit {

  constructor(private service: NodeapiService) 
     { }

     ngOnInit() {

      this.resetForm();
  
    }
  
    resetForm(form?: NgForm) {
      if (form != null)
        form.resetForm();
      this.service.formData = {
        BanqueID: null,
        Nom: '',
        Email :'',
        MotDePasse:''
      }
    }
    onSubmit(form: NgForm) {
      if (form.value.BanqueID == null)
      this.service.makeRequest(apiUrl.createBank,form.value.FullName);
    }
}