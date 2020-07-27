import { HomePage } from './../home/home';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import {  FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'clientelogin.html',
})
export class ClienteLoginPage {
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {

  }



  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }


  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    return loading;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  onHomePage(): void {
    this.navCtrl.push(HomePage).then(
      (hasAccess: boolean) => {
        //console.log('Autorizado : ', hasAccess);
      }
    ).catch(err => {
      //console.log('Não Autorizado : ', err);
    });
  }


  onLogout(): void {
    this.authService.logout();
  }

}
