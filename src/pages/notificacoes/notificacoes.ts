import { HomePage } from './../home/home';
import { MessageServiceProvider } from './../../providers/message/message.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { User } from './../../models/user.model';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, Content, MenuController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user.service';
import firebase from 'firebase';
import { Notificacao } from '../../models/notificacao.model';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notificacoes.html',
})
export class NotificacoesPage {
  notificacoes: FirebaseListObservable<Notificacao[]>;
  pageTitle: string;
  scrou : number = 8;
  sender: User;

  podeir:number = 1;
  @ViewChild(Content) content :Content;
  constructor(public menuCtrl:MenuController, public messageService: MessageServiceProvider, public userService: UserServiceProvider, public authService: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true,'user-menu');
  }
  ionViewDidLoad() {/*
    this.menuCtrl.enable(false,'user-menu');

    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.sender = currentUser;
      
     
      

      let doSubscription = () =>{
        this.notificacoes.subscribe((notificacoes:Notificacao[])=>{
          notificacoes.forEach(n=>{
          if(!n.lida){ 
            this.messageService.editNotificacao(n);
            this.scrollToTop();          
          }
          });
          });
      };
    
     
      this.notificacoes = this.messageService.getNotificacoes(this.sender.$key);
      this.notificacoes.first().subscribe((notificacoes: Notificacao[]) => {
        if (notificacoes.length === 0) {
          this.notificacoes = this.messageService.getNotificacoes(this.sender.$key);
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
visualizar(notificacao:Notificacao){
  let recipientUserId: string = notificacao.senderKey;
    this.userService.get(recipientUserId).first().subscribe(
      (user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      }
    );
  }
  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }
 
  
  private scrollToTop(duration ?:number):void{
    setTimeout(()=>{
      if(this.content._scroll){
        this.content.scrollToTop(duration || 0);
      }
    },50);
  }

 
  
 doInfinite(infiniteScroll) {


  if(infiniteScroll){
   
		setTimeout(() => {
   
  this.userService.currentUser.first().subscribe((currentUser: User) => {
    this.sender = currentUser;
    this.messageService.loadMoreObjects();
    this.notificacoes = this.messageService.getNotificacoes(this.sender.$key);
    this.notificacoes.first().subscribe((notificacoes: Notificacao[]) => {
  if (notificacoes.length === 0) {
    this.notificacoes = this.messageService.getNotificacoes(this.sender.$key);
  }
  else{
  }
});
});

      infiniteScroll.complete();
		}, 900);
  }     

}
}
