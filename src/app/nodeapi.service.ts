import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banque } from './banque.modele';

@Injectable({
  providedIn: 'root'
})
export class NodeapiService {
  public token: string;
  public refreshToken: string;
  public address: string;
  public banque: string;
  public email: string;
  public permission: string;
  public portefeuilles: any[];
  public nom: string;
  public prenom: string;
  public civilite: string;
  public situationFamiliale: string;
  public profession: string;
  public siret: string;
  public tel: string;
  public adresse: string;
  public ville: string;
  public codePostal: string;
  public documents: any;

  private readonly url: string = environment.apiUrl;
  formData: Banque;
  list: Banque[];

  constructor(private http: HttpClient) {
    apilog('getting current User');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser) {
      this.setLogin(currentUser);
    }
    this.logLogin();
  }

  createClient(email: string, password: string, banque: string): Observable<any> {
    const headers = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Content-Type-Options': 'nosniff'
      })};
    apilog('req: [ ' + this.url + 'createClient/ ] post {email: ' + email + ', password: ' + password + ', banque: ' + banque + '}');
    return this.http.post<any>(this.url + 'createClient/', {
        email, password, banque }, headers).pipe(map(
          res => {
            apilog('Got response:');
            console.log(res);
            return res;
          }));
  }

  makeRequest(iApiurl: apiUrl, data: any): Observable<any> {
    const aUrls = iApiurl.split('$');
    const atype = aUrls[0];
    const aUrl = aUrls[1];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Content-Type-Options': 'nosniff',
      authorization: 'Bearer ' + this.token
      });
    apilog('req ' + atype + ' : [ ' + this.url + aUrl + ' ] data :');
    console.log(data);
    if (atype === 'POST') {
      return this.http.post<any>(this.url + aUrl, data, {headers}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'PUT') {
      return this.http.put<any>(this.url + aUrl, data, {headers}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'GET') {
      data.observe = 'response';
      return this.http.get<any>(this.url + aUrl, {headers, params: data}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'DELETE') {
      data.observe = 'response';
      return this.http.delete<any>(this.url + aUrl, {headers, params: data}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
  }

  login(email: string, password: string, saveToken: boolean = false): Observable<any> {
    return this.http.post<any>(this.url + 'auth/', { email, password })
      .pipe(
        map(res => {
          apilog('Got response:');
          console.log(res);
          if (res && res.accessToken) {
            if (saveToken) {
              localStorage.setItem('currentUser', JSON.stringify(res));
            }
            this.setLogin(res);
            this.logLogin();
          }
          return res;
        })
      );
  }

  setLogin(obj: any) {
    this.token = obj.accessToken;
    this.refreshToken = obj.refreshToken;
    this.email = obj.email;
    this.portefeuilles = obj.portefeuilles;
    this.banque = obj.banque;
    this.nom = obj.nom;
    this.prenom = obj.prenom;
    this.civilite = obj.civilite;
    this.situationFamiliale = obj.situation_familiale;
    this.profession = obj.profession;
    this.siret = obj.siret;
    this.tel = obj.tel;
    this.adresse = obj.adresse;
    this.ville = obj.ville;
    this.codePostal = obj.code_postal;
    this.documents = obj.documents;
    this.permission = obj.permission;
  }

  logLogin() {
    apilog('token: ' + this.token);
    apilog('refreshToken: ' + this.refreshToken);
    apilog('email: ' + this.email);
    apilog('portefeuilles: ');
    console.log(this.portefeuilles);
    apilog('banque: ' + this.banque);
    apilog('nom: ' + this.nom);
    apilog('prenom: ' + this.prenom);
    apilog('civilite: ' + this.civilite);
    apilog('situationFamiliale: ' + this.situationFamiliale);
    apilog('profession: ' + this.profession);
    apilog('siret: ' + this.siret);
    apilog('tel: ' + this.tel);
    apilog('adresse: ' + this.adresse);
    apilog('ville: ' + this.ville);
    apilog('codePostal: ' + this.codePostal);
    apilog('documents: ' + this.documents);
    apilog('permission: ' + this.permission);
    apilog('adresse : ' + this.adresse);
    apilog('banque : ' + this.banque);
    apilog('email : ' + this.email);
    apilog('permission : ' + this.permission);
  }

  isConnected() {
    return this.token !== null && this.token !== 'undefined';
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getListBanque() {
    return [

    //  this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];

      {id: '4587',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '458',nom: 'alex', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45787',nom: 'bnb', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45987',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'je000', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'}
      
    ];
  }

  getBanque() {
    return [

    //  this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];

      {id: '4587',nom: 'jebfjbef', email: 'ZEFZEF',telephone:'54545545', portefeuille:'445454545445',}
    ];
  }
  }



export enum apiUrl {
  clients = 'GET$clients',
  allClients = 'GET$allClients',
  allBanks = 'GET$allBanks',
  allBanksVisible = 'GET$allBanksVisible',
  allBanksNotVisible = 'GET$allBanksNotVisible',
  createBank = 'POST$createBank/',
  createClient = 'POST$createClient/',
  blockClient = 'PUT$blockClient/',
  unBlockClient = 'PUT$unBlockClient/',
  updateClient = 'PUT$updateClient/',
  updateBanque = 'PUT$updateBanque/',
  createBankClient = 'POST$createBankClient/',
  createContact = 'POST$createContact/',
  deleteBank = 'DELETE$deleteBank',
  deleteClient = 'DELETE$deleteClient',
  deleteContact = 'DELETE$deleteContact',
  submit = 'POST$submit',
  issueDHTG = 'POST$issueDHTG',
}

function apilog(ilog: string) {
  console.log('[NODEAPI] ' + ilog);
}

