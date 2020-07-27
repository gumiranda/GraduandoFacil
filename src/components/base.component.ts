import { WelcomePage } from './../pages/welcome/welcome';
import { AuthServiceProvider } from './../providers/auth/auth.service';
import { AlertController, App, MenuController, NavController } from 'ionic-angular';
import { OnInit } from '@angular/core';
import { ClienteLoginPage } from '../pages/clienteLogin/clientelogin';

export abstract class BaseComponent implements OnInit {
    protected navCtrl: NavController;
    constructor(public alertCtrl: AlertController, public authService: AuthServiceProvider,
        public app: App, public menuCtrl: MenuController) {

    }
    ngOnInit(): void {
      this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void {

        this.alertCtrl.create({
            message: 'Deseja sair?',
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.authService.logout().then(
                            () => {
                                this.navCtrl.setRoot(WelcomePage);
                                this.menuCtrl.enable(false,'user-menu');
                            }
                        );
                    }
                },
                { text: 'Não' }
            ]
        }).present();
    }


}