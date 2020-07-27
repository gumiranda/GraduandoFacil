import { HomePage } from './../home/home';
import { MessageServiceProvider } from './../../providers/message/message.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { User } from './../../models/user.model';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, Content, MenuController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user.service';
import firebase from 'firebase';
import { Denuncia } from '../../models/denuncia.model';
import { ChatPage } from '../chat/chat';
import { SpottedServiceProvider } from '../../providers/spotted/spotted.service';
import { DenunciaService } from '../../providers/denuncia/denuncia.service';


@Component({
  selector: 'page-denuncias',
  templateUrl: 'denuncias.html',
})
export class DenunciasPage {
  denuncias: FirebaseListObservable<Denuncia[]>;
  pageTitle: string;
  scrou : number = 8;
  sender: User;

  podeir:number = 1;
  @ViewChild(Content) content :Content;
  constructor(public menuCtrl:MenuController,public denunciaService:DenunciaService,public spottedService:SpottedServiceProvider ,public messageService: MessageServiceProvider, public userService: UserServiceProvider, public authService: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true,'user-menu');
  }
  ionViewDidLoad() {
    this.denuncias = this.denunciaService.denuncias;
    /*
    this.menuCtrl.enable(false,'user-menu');

    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.sender = currentUser;
      
     
      

      let doSubscription = () =>{
        this.denuncias.subscribe((denuncias:Denuncia[])=>{
          denuncias.forEach(n=>{
          if(!n.lida){ 
            this.messageService.editDenuncia(n);
            this.scrollToTop();          
          }
          });
          });
      };
    
     
      this.denuncias = this.messageService.getDenuncias(this.sender.$key);
      this.denuncias.first().subscribe((denuncias: Denuncia[]) => {
        if (denuncias.length === 0) {
          this.denuncias = this.messageService.getDenuncias(this.sender.$key);
        doSubscription();
          
        }
        else{
            doSubscription();
            }
      });
    });
//    this.scrou = 1;
*/

  }
banir(denuncia:Denuncia){
  if(denuncia.idSpotted === ''){
    if(denuncia.idComentario !== ''){
   this.spottedService.deletarComentario(denuncia.idComentario);
    }
  }else{
  this.spottedService.deleteComId(denuncia.idSpotted);
  } 
this.userService.delete(denuncia.denunciado);
}
deletarDenuncia(denuncia:Denuncia){
  this.denunciaService.delete(denuncia);
}
  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }
 
  

 
}
