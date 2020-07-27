import { StoriesListPage } from './../stories-list/stories-list';
import { FirebaseAuthState } from 'angularfire2';
import { UserServiceProvider } from './../../providers/user/user.service';
import { StoryPhotoPage } from './../story-photo/story-photo';
import { SignupPage } from './../signup/signup';
import { HomePage } from './../home/home';
import { ClienteLoginPage } from './../clienteLogin/clientelogin';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, App, AlertController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Facebook } from '@ionic-native/facebook';
import SHA_256 from 'sha256/lib/nodecrypto';

@IonicPage({name:'welcome'})
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  signinForm: FormGroup;
  isLoggedIn:boolean = false;
  isLoggedSpottedIn:boolean;
face:boolean;
  users: any;
  constructor(
    public loadingCtrl: LoadingController,
    public app: App,
    public userService:UserServiceProvider,
    public fb:Facebook,
    public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public formBuilder: FormBuilder, 
  ) {
    console.log("aaaaaaaaaa",window.location.href);
//FACEBOOK MÉTODO DE VERIFICAÇÃO SE O USUÁRIO ESTÁ LOGADO
fb.getLoginStatus()
.then(res => {
  ////console.log(res.status);
  if(res.status === "connect") {
    this.isLoggedIn = true;
  } else {
    this.isLoggedIn = false;
  }
})
.catch(e => console.log(e)
);


this.face = navParams.get('face');


    let emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.compose([Validators.required, Validators.pattern(emailRegex)])]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });


   }

   loginFace() {
    const loading = this.loadingCtrl.create({
      duration: 50
    });
    
    loading.onDidDismiss(() => {
//      this.fb.login(['user_likes','public_profile', 'user_friends', 'email','user_friends','user_gender','user_posts','user_birthday','user_events'])
      this.fb.login(['public_profile', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
  this.getUserDetail(res.authResponse.userID);
          } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => {
        alert("Erro no login com facebook,tente outra vez");    
        //console.log('Error logging into Facebook', e)
      }
    );        
    });
    
    loading.present();


  }
  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }
  getUserDetail(userid) {
    const loading2 = this.loadingCtrl.create({
      duration: 50
    });
    
//    this.fb.api("/"+userid+"/?fields=id,email,relationship_status,name,picture.width(320).height(320).as(picture_large),gender",["public_profile"])
    this.fb.api("/"+userid+"/?fields=id,email,name,picture.width(320).height(320).as(picture_large),gender",["public_profile"])
      .then(res => {
        //console.log(res);
  let formUser = res;
  let email = res.email;
  formUser.photo = res.picture_large.data.url;
  formUser.distance = 100;
  formUser.username = res.email;
  formUser.timestampConcordou = Math.floor(Date.now()/1000);
  delete formUser.picture_large;
  this.userService.emailExists(email).first().subscribe(
    (userExists: boolean) => {
      if(userExists){
        let pwde = res.id+SHA_256(res.id).toString()+res.id;
        this.authService.signinWithEmail( { email: res.email, password: pwde }).then(
          (isLogged: boolean) => {
            if (isLogged) {
              this.isLoggedSpottedIn = true;
              this.navCtrl.setRoot(HomePage,{
                visao:'feed',
                face:true
              });
            }
            
          }
        ).catch(e=>{
          this.isLoggedSpottedIn = false;
        });     
      }else{
        let alert = this.alertCtrl.create({
          title: 'Confirmar cadastro',
          message: '<p>Você aceita os termos de uso?</p>',
              buttons: [
           
            {
              text: 'Sim',
              handler: () => {
                let alert2 = this.alertCtrl.create({
                  title: 'Complete o cadastro',
                  inputs: [
                    {
                      name: 'faculdade',
                      placeholder: 'Digite sua universidade'
                    },
                    {
                      name: 'curso',
                      placeholder: 'Digite o curso'
                    }
                  ],
                      buttons: [
                       
                    {
                      text: 'Enviar',
                      handler: data => {
               formUser.curso = data.curso;
               formUser.curso = formUser.curso[0].toUpperCase() + formUser.curso.slice(1);
               formUser.facebookflag = true;
               formUser.faculdade = (data.faculdade).toUpperCase();
               let loading: Loading = this.showLoading();
               formUser.id = formUser.id+SHA_256(formUser.id).toString()+formUser.id;
                this.authService.createAuthUser({
                  email: formUser.email,
                  password: formUser.id
                }).then((authState: FirebaseAuthState) => {
                  delete formUser.id;      
                  let uuid: string = authState.auth.uid;
                  this.userService.create(formUser, uuid).then(() => {
                    //console.log('usuario cadastrado');
                    loading.dismiss();
                    this.navCtrl.setRoot(HomePage,{
                      visao:'feed'
                    });
                  }).catch((error: any) => {
                    //console.log(error);
                    this.showAlert("Erro no cadastro");
                  }).catch((error: any) => {
                    this.showAlert("Erro no cadastro");
                    //console.log(error);
                 //   this.showAlert(error);
                  });
                });    
                


                        }
                    }
                    
                  ]
                });
                alert2.present();   
            }
            }
            ,{
              text: 'Não',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }, {
              text: 'Ver termos',
              handler: () => {
                this.navCtrl.push(StoriesListPage);
              }
            }
          ]
        });
        alert.present();

        }  
    });
        this.users = res;
      })
      .catch(e => {
        //console.log(e);
      })      
      ;
      loading2.present();

  }
  
   onSubmit(): void {
    let loading: Loading = this.showLoading();
    this.authService.signinWithEmail(this.signinForm.value)
    .then(
      (isLogged: boolean) => {
        if (isLogged) {
          if(this.authService.getEmailVerified() === true){
            this.navCtrl.setRoot(HomePage,{
              visao:'feed',
              face:false
            });
            loading.dismiss();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Confirme o seu email para realizar o login',
                  buttons: [
               
                {
                  text: 'OK',
                  handler: () => {
                    loading.dismiss();
                     }
                }
                
              ]
            });
            alert.present();

          }
        }
      }
    ).catch(
      (error: any) => {
        loading.dismiss();
        this.showAlert(error);
      });
  }

  onHomePage(): void {
    this.navCtrl.push(HomePage,{
      face:this.face
    }).then(
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

ionViewDidLoad(){
  console.log("aaaaaaaaaa2",window.location.href);

  this.navCtrl.setRoot(HomePage,{
    visao:'feed',
    face:this.face
  }).then(
    (hasAccess: boolean) => {
      console.log('Autorizado : ', hasAccess);
    }
  ).catch(err => {
    console.log('Não Autorizado : ', err);
  });

}


 ionViewWillLeave(){
   
 }

  // Gradient logic from https://codepen.io/quasimondo/pen/lDdrF
  // NOTE: I'm not using this logic anymore, but if you want to use somehow, somewhere,
  // A programmatically way to make a nice rainbow effect, there you go.
  // NOTE: It probably won't work because it will crash your phone as this method is heavy \o/
  colors = new Array(
    [62, 35, 255],
    [11, 57, 66],
    [255, 35, 98],
    [45, 175, 230],
    [255, 0, 255],
    [255, 128, 0]);

  step = 0;
  // color table indices for:
  // [current color left,next color left,current color right,next color right]
  colorIndices = [0, 1, 2, 3];

  // transition speed
  gradientSpeed = 0.00005;
  gradient = '';

  updateGradient() {

    const c00 = this.colors[this.colorIndices[0]];
    const c01 = this.colors[this.colorIndices[1]];
    const c10 = this.colors[this.colorIndices[2]];
    const c11 = this.colors[this.colorIndices[3]];

    const istep = 1 - this.step;
    const r1 = Math.round(istep * c00[0] + this.step * c01[0]);
    const g1 = Math.round(istep * c00[1] + this.step * c01[1]);
    const b1 = Math.round(istep * c00[2] + this.step * c01[2]);
    const color1 = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')';

    const r2 = Math.round(istep * c10[0] + this.step * c11[0]);
    const g2 = Math.round(istep * c10[1] + this.step * c11[1]);
    const b2 = Math.round(istep * c10[2] + this.step * c11[2]);
    const color2 = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';

    this.gradient = `-webkit-gradient(linear, left top, right bottom, from(${color1}), to(${color2}))`;
    this.step += this.gradientSpeed;
    if (this.step >= 1) {
      this.step %= 1;
      this.colorIndices[0] = this.colorIndices[1];
      this.colorIndices[2] = this.colorIndices[3];

      // pick two new target color indices
      // do not pick the same as the current one
      this.colorIndices[1] =
        (this.colorIndices[1] + Math.floor(1 + Math.random() * (this.colors.length - 1)))
        % this.colors.length;

      this.colorIndices[3] =
        (this.colorIndices[3] + Math.floor(1 + Math.random() * (this.colors.length - 1)))
        % this.colors.length;

    }

    setInterval(() => { this.updateGradient(); }, 10);
  }
irCliente() : void{
  this.navCtrl.push(ClienteLoginPage);
}
irCadastro() : void{
  this.navCtrl.push(SignupPage);
}

testarPhoto():void{
  this.navCtrl.push(StoryPhotoPage);

}
irHome() : void{
  this.navCtrl.push(HomePage);
}
}
