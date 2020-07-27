import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage, MenuController } from 'ionic-angular';



@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
usuario:any;
//public person: {name: string, company: string, birthdate?: number};
dob: any;
age: any;
usuariosperto;
chave;
showProfile: boolean;
  constructor(public navCtrl: NavController,
    public menuCtrl:MenuController, public navParams: NavParams) {
    this.usuario = navParams.get('usuario');
    this.chave = navParams.get('usuarioAtual');

    if(navParams.get('usuariosperto') === undefined){}
    else{
   if (navParams.get('usuariosperto') < 1){
   this.usuariosperto = (navParams.get('usuariosperto')*1000).toFixed(0);
   this.usuariosperto += " metros";
   }
   else{
    this.usuariosperto = (navParams.get('usuariosperto')).toFixed(0);
    this.usuariosperto +=" km";
   }
  }
   console.log(this.usuariosperto);
    //console.log(this.usuario);
    /*this.person = {name: undefined, company: undefined, birthdate: undefined};
    this.dob = undefined;*/
  }
  text: any;
  public data: number = 456;
 

  ionViewWillLeave() {
   if(this.menuCtrl.isEnabled('user-menu')){
    this.menuCtrl.enable(false,'user-menu');
   }else{
    this.menuCtrl.enable(true,'user-menu');
   }
  
  }
  ionViewDidLoad() {
    this.menuCtrl.enable(false,'user-menu');

  /*
    let person = JSON.parse(localStorage.getItem('PERSON'));
    if (person){
      this.person = person;
      this.age = this.getAge(this.person.birthdate);
      this.dob = new Date(this.person.birthdate).toISOString();
    }*/
    //console.log('ionViewDidLoad PerfilPage');
  }

  /*
  reset(){
    this.person = {name: null, company: null, birthdate: null};
    this.dob = null;
    this.showProfile = false;
  }

  save(){
    this.person.birthdate = new Date(this.dob).getTime();
    this.age = this.getAge(this.person.birthdate);
    this.showProfile = true;
    localStorage.setItem('PERSON', JSON.stringify(this.person));
  }

  getAge(birthdate){
    let currentTime = new Date().getTime();
     return ((currentTime - birthdate)/31556952000).toFixed(0);
  }
*/
}
