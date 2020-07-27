import { StoriesListPage } from './../stories-list/stories-list';
import { FirebaseAuthState } from 'angularfire2';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import { UserServiceProvider } from './../../providers/user/user.service';
import { Component } from '@angular/core';
import {  NavController, NavParams, Loading, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';

/**
* Generated class for the SignupPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  usuarioFace:any ;
  emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  signupForm: FormGroup
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public userService: UserServiceProvider, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
      this.usuarioFace = navParams.get('usuarioFace');
      
      //console.log(this.usuarioFace,"USUARIO FACE");
      this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      curso: ['', [Validators.required, Validators.minLength(3)]],
      faculdade: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      termos: [false,Validators.pattern('true')],

    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignupPage');
  
  }
  openTermos(){
    this.navCtrl.push(StoriesListPage);
  }
LoginFacebook(){
  let loading: Loading = this.showLoading();
  let formUser = this.usuarioFace;
  let curso = this.usuarioFace.name.replace(/^\s+|\s+$/g,"");
  formUser.photo = this.usuarioFace.picture.data.url;
  formUser.distance = 100;
  delete formUser.picture;

  this.userService.emailExists(formUser.email).first().subscribe(
    (userExists: boolean) => {
        this.authService.createAuthUser({
          email: formUser.email,
          password: formUser.id
        }).then((authState: FirebaseAuthState) => {
          delete formUser.id;
          let uuid: string = authState.auth.uid;
          formUser.facebookflag = false;
          this.userService.create(formUser, uuid).then(() => {
            //console.log('usuario cadastrado');
            this.navCtrl.setRoot(WelcomePage);
            loading.dismiss();
          }).catch((error: any) => {
            //console.log(error);
            loading.dismiss();
            this.showAlert(error);
          }).catch((error: any) => {
            //console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });

        });
        //console.log("testando form");
      
    });

}

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    formUser.photo = '';
    formUser.faculdade = formUser.faculdade.toUpperCase();
    formUser.timestampConcordou = firebase.database.ServerValue.TIMESTAMP;
        formUser.distance = 99;
    //this.userService.userExists(curso).take(1).subscribe(

    this.userService.emailExists(formUser.email).first().subscribe(
      (userExists: boolean) => {
        if (!userExists) {
         // this.authService.
         this.authService.createAuthUser({
          email: formUser.email,
          password: formUser.password
        }).then(()=>{
          delete formUser.password;
          this.authService.sendEmailVerification(); 
          this.userService.create(formUser,this.authService.getUserId());     
          loading.dismiss();       
        });
      
         let alert = this.alertCtrl.create({
          title: 'Cadastro feito com sucesso!',
          message:'Confirme o seu email para realizar o login',
              buttons: [
            {
              text: 'OK',
              handler: () => {
               loading.dismiss();
                this.navCtrl.setRoot(WelcomePage,{
                  face:false
                });
                 }
            }
            
          ]
        });
        alert.present();
         /*
          this.authService.createAuthUser({
            email: formUser.email,
            password: formUser.password
          }).then(()=>{
            delete formUser.password;
            loading.dismiss();
          
          })
          .then((authState: FirebaseAuthState) => {
            delete formUser.password;
            let uuid: string = authState.auth.uid;
            console.log(uuid,"ou");
            console.log(authState,"ou");

           
            this.userService.create(formUser, uuid).then(() => {
              console.log('usuario cadastrado');
              //this.navCtrl.setRoot(HomePage);
              loading.dismiss();
            }).catch((error: any) => {
              //console.log(error);
              loading.dismiss();
              this.showAlert(error);
            }).catch((error: any) => {
              ////console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });

          });
         */
          
          //console.log("testando form");
        } else {
          this.showAlert('o email já está sendo utilizado em outra conta');
          loading.dismiss();
        }
      });

  }//fim do método onSubmit

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


ionViewWillLeave(){
  this.authService.logout();
}
}
