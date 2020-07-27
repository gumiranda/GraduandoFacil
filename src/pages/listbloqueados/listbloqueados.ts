import { BloqueadoService } from './../../providers/bloqueado/bloqueado.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';
import { UserServiceProvider } from '../../providers/user/user.service';
import { NavParams, NavController, IonicPage } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { Bloqueado } from '../../models/bloqueado.model';

@Component({
  selector: 'list-bloqueados',
  templateUrl: 'listbloqueados.html',
})
export class ListbloqueadosPage {
  currentUser: User;
  bloqueados: FirebaseListObservable<Bloqueado[]>;

  constructor(public bloqueadoservice:BloqueadoService,public userService: UserServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  }
  desbloquear(desbloqueio:Bloqueado):void{
   this.bloqueadoservice.delete(desbloqueio);
  }
  ionViewWillEnter() {
   
  }
  
  ionViewDidLoad() {
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
        this.bloqueados = this.bloqueadoservice.getAllBloqueados(user.$key);
      }
    );
   
    //console.log('ionViewDidLoad SpottedPage');
  }

}