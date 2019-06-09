import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banque } from './banque.modele';
import { Portefeuille } from './Portefeuille.modele';

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
  public cartes: any[];
  public nom: string;
  public prenom: string;
  public fullname: string;
  public civilite: string;
  public situationFamiliale: string;
  public profession: string;
  public siret: string;
  public tel: string;
  public adresse: string;
  public ville: string;
  public codePostal: string;
  public documents: any;
  public statut: number;

  private readonly url: string = environment.apiUrl;
  private readonly urlOpenchain: string = environment.openchainUrl;

  formData: Banque;
  list: Banque[];

  constructor(private http: HttpClient) {
    apilog('getting current User');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.setLogin(currentUser);
    }
    this.logLogin();
  }

  createClient(email: string, password: string, prenom: string, nom: string, banque: string): Observable<any> {
    const headers = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Content-Type-Options': 'nosniff'
      })};
    apilog('req: [ ' + this.url + 'createClient/ ] post {email: ' + email + ', password: ' + password +
      ', prenom: ' + prenom + ', nom: ' + nom + ', banque: ' + banque + '}');
    return this.http.post<any>(this.url + 'createClient/', {
        email, password, prenom, nom, banque }, headers).pipe(map(
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
    localStorage.removeItem('currentUser');
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

  register(email: string, password: string, prenom: string, nom: string, banque: string, roleId: number): Observable<any> {
    return this.http.post<any>(this.url + 'createClient/', { email, password, prenom, nom, banque, roleId })
      .pipe(
        map(res => {
          apilog('Got response:');
          console.log(res);
          return res;
        })
      );
  }

  setLogin(obj: any) {
    this.token = obj.accessToken;
    this.refreshToken = obj.refreshToken;
    this.email = obj.email;
    this.portefeuilles = obj.portefeuilles;
    this.cartes = obj.cartes;
    this.banque = obj.banque;
    this.nom = obj.nom;
    this.prenom = obj.prenom;
    this.fullname = obj.prenom + ' ' + obj.nom;
    this.civilite = obj.civilite;
    this.situationFamiliale = obj.situation_familiale;
    this.profession = obj.profession;
    this.siret = obj.siret;
    this.tel = obj.tel;
    this.adresse = obj.adresse;
    this.ville = obj.ville;
    this.codePostal = obj.code_postal;
    this.statut = obj.statut;
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
    apilog('statut : ' + this.statut);
    apilog('permission : ' + this.permission);
  }

  isConnected() {
    return this.token !== null && this.token !== 'undefined';
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getAllAccountsFromOpenchain() {
    return this.http.get<any>(this.urlOpenchain + 'query/subaccounts?account=%2F', {}).pipe(map(
      res => {apilog('Got response:'); console.log(res); return res; }));
  }

  getRecord(adress) {
    return this.http.get<any>(this.urlOpenchain + 'query/account?account=%2Fp2pkh%2F' + adress + '%2F', {}).pipe(map(
      res => {apilog('Got response:'); console.log(res); return res; }));
  }

  Utf8ToHex(str) {
    try {
      return unescape(encodeURIComponent(str)).split('').map( v => {
        return v.charCodeAt(0).toString(16);
          }).join('');
    } catch (e) {
      console.log('invalid text input: ' + str);
    }
  }

  HexToString(s) {
    return decodeURIComponent(s.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
  }

  arrayHexInteger(hexString) {
    let items = '';
    const res = [];
    hexString.split('').map(item => {
      items += item;
      if (items.length === 2) {
        res.push(parseInt(items, 16));
        items = '';
      }
    });
    return res;
  }

readVarint64(buffer) {
    let offset = 0;
    offset >>>= 0;
    // ref: src/google/protobuf/io/coded_stream.cc
    const start = offset;
    let part0 = 0;
    let part1 = 0;
    let part2 = 0;
    let b     = 0;
    b = buffer[offset++]; part0  = (b & 0x7F)      ; if ( b & 0x80                              ) {
    b = buffer[offset++]; part0 |= (b & 0x7F) <<  7; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part0 |= (b & 0x7F) << 14; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part0 |= (b & 0x7F) << 21; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part1  = (b & 0x7F)      ; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part1 |= (b & 0x7F) <<  7; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part1 |= (b & 0x7F) << 14; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part1 |= (b & 0x7F) << 21; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part2  = (b & 0x7F)      ; if ((b & 0x80) || (typeof b === 'undefined')) {
    b = buffer[offset++]; part2 |= (b & 0x7F) <<  7; if ((b & 0x80) || (typeof b === 'undefined')) {
    throw Error("Buffer overrun"); }}}}}}}}}}
    return part0 | (part1 << 28);
}

getTransactions(address) {
  address = '/p2pkh/' + address + '/:ACC:/asset/p2pkh/XkjpCHJhrNja3z5qoaX9JvdijMMD32oEyD/';
  address = this.Utf8ToHex(address);
  return this.http.get<any>(this.urlOpenchain + 'query/recordmutations?key=' + address, {}).pipe(map(
      res => {
        apilog('Got response:');
        console.log(res);
        const transactions = [];
        const observables = [];
        res.forEach(element => {
          element = element.mutation_hash;
          console.log('calling mutation: ', element);
          observables.push(this.http.get(
            this.urlOpenchain + 'query/transaction?format=raw&mutation_hash=' + element));
          });
        return forkJoin(observables).pipe(map(
          result => {
            console.log('raw transaction: ', result);
            result.forEach( raw => {
              raw = raw.raw;
              raw = raw.substr(36, raw.length).split('120a0a08');
              raw[0] = this.HexToString(raw[0]);
              raw[0] = raw[0].substr(7, raw[0].length).split('/:ACC:/')[0];
              raw[4] = parseInt(raw[1].substr(0, 16), 16);
              raw[1] = raw[1].split('126d0a5f')[1];
              raw[1] = this.HexToString(raw[1]);
              raw[1] = raw[1].substr(7, raw[1].length).split('/:ACC:/')[0];
              raw[3] = parseInt(raw[2].substr(0, 16), 16);
              raw[2] = raw[2].substr(18, raw[2].lenght);
              raw[2] = this.arrayHexInteger(raw[2]);
              raw[2] = this.readVarint64(raw[2]);
              transactions.push(raw);
            });
            console.log('transactions: ', transactions);
            return transactions;
        }));
    }));
  }

  getListBanque() {
    return [

    //  this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];

      {id: '4587',nom: 'xtx', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '458',nom: 'alex', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45787',nom: 'bnb', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45987',nom: 'fred', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'je000', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BankOS', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'987945',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'AFRIBANK', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'787454',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'TOAST', date: '23/04/2019',nbClient:'54545545', nbPortefeuille:'5445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'CREDIT AGRICOLR', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'45445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'zest', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BANK AVENIR', date: '25/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'FACILEBANK', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '29/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BANK AVENIR', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'citron', date: '20/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'}
    ];
  }

  ID: Number;
  Nom: string;
  Portefeuille: string;
  Date: string;
  MaxTransaction :number
  MaxTransactionMoi:number;
  Status :string
  _contactList: Portefeuille[] =  [
     { ID: 1 , Nom: "aaaaaaaaaaaaa", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
    ,{ ID: 2, Nom: "sdvsdvsd", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
    ,{ ID: 3 , Nom: "ggfhfghfg", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
    ,{ ID: 4 , Nom: "aaaaaaaa", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
    ,{ ID: 5 , Nom: "aaaaaaaaaaaaa", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
    ,{ ID: 6 , Nom: "aaaaaaaaaaaaa", Portefeuille: "zzzzzz", Date: "eeeeeee", MaxTransaction:1000,MaxTransactionMoi:10000,Status:"Actif"}
  ];

  _monnieElectronqueList =  [
    { ID: 1 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "BITCOIN", UniteMonnieY:5},
    { ID: 2 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "ETHERHOM", UniteMonnieY:15},
    { ID: 3 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "RANK", UniteMonnieY:0.5},
    { ID: 4 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "MONNECIE", UniteMonnieY:0.15},
    { ID: 5 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "XXX", UniteMonnieY:0.15},
    { ID: 6 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "YYY", UniteMonnieY:0.15},
    { ID: 7 , NomMonnieX: "DHTG", UniteMonnieX: 1, NomMonnieY: "ZZZ", UniteMonnieY:0.15}

 ];
 _monniePysiqueList =  [
  { ID: 1 , NomMonnieElectroniqueX: "Digital HaïTian Gourde", UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: "EUROS", UniteMonniePhysiqueY:5},
  { ID: 2 , NomMonnieElectroniqueX: "Digital HaïTian Gourde", UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: "DOLLAR AMERCICAIN", UniteMonniePhysiqueY:15},
  { ID: 3 , NomMonnieElectroniqueX: "Digital HaïTian Gourde", UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: "DOLLAR CANADIEN", UniteMonniePhysiqueY:0.5},
  { ID: 4 , NomMonnieElectroniqueX: "Digital HaïTian Gourde", UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: "DINAR ALGERIEN", UniteMonniePhysiqueY:0.15},

];

  editContact(contact: Portefeuille) {
    const index = this._contactList.findIndex(c => c.ID === contact.ID);
    console.log(contact);
    this._contactList[index] = contact;
    console.log("nadir")
  }

  getAllContacts() {
    return this._contactList;
  }

  getAllMonnieElectronique(){
    return this._monnieElectronqueList;
  }

  
  getAllMonniePhysique(){
    return this._monniePysiqueList;
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
  allMonnies = 'GET$allMonnies',
  allBanksVisible = 'GET$allBanksVisible',
  allBanksNotVisible = 'GET$allBanksNotVisible',
  allBanksValid = 'GET$allBanksValid',
  allBanksNotValid = 'GET$allBanksNotValid',
  createBank = 'POST$createBank/',
  createClient = 'POST$createClient/',
  createPortefeuille = 'POST$createPortefeuille/',
  createCarte = 'POST$createCarte/',
  cardsByPortefeuilleIds = 'POST$cardsByPortefeuilleIds/',
  blockClient = 'PUT$blockClient/',
  unBlockClient = 'PUT$unBlockClient/',
  updateClient = 'PUT$updateClient/',
  updateCarte = 'PUT$updateCarte/',
  updateBanque = 'PUT$updateBanque/',
  updateMonnie = 'PUT$updateMonnie/',
  createBankClient = 'POST$createBankClient/',
  createContact = 'POST$createContact/',
  deleteBank = 'DELETE$deleteBank',
  deleteMonnieElectronique = 'DELETE$deleteMonnieElectronique',
  deleteClient = 'DELETE$deleteClient',
  deleteContact = 'DELETE$deleteContact',
  deletePortefeuille = 'DELETE$deletePortefeuille',
  submit = 'POST$submit',
  issueDHTG = 'POST$issueDHTG',
}

function apilog(ilog: string) {
  console.log('[NODEAPI] ' + ilog);
}

