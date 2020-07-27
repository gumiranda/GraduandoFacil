import { StoryPhotoPage } from './../../pages/story-photo/story-photo';
import { StoriesListPage } from './../../pages/stories-list/stories-list';
import { User } from './../../models/user.model';
import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AlertController, App, MenuController, Platform } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth/auth.service';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { ProfissionalLoginPage } from '../../pages/profissionalLogin/profissionallogin';
import { NotificacoesPage } from '../../pages/notificacoes/notificacoes';

/**
 * Generated class for the UserMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent {
plataforma:boolean=false;
@Input('user') currentUser : User; 
  constructor(public alertCtrl: AlertController, public authService: AuthServiceProvider,
    public app: App, public menuCtrl: MenuController,public platform:Platform) {
super(alertCtrl,authService,app,menuCtrl);
if(platform.is('android')){
this.plataforma = true;
}
    }
    onProfile() : void{
      this.navCtrl.push(UserProfilePage);
    }
    onNotificacoes() : void{
      this.navCtrl.push(NotificacoesPage);
    }
    onStories() : void{
      this.navCtrl.push(ProfissionalLoginPage);
    }
    onStories2() : void{
      this.navCtrl.push(StoryPhotoPage);
    }
    onTermos() : void{
      this.navCtrl.push(StoriesListPage);
    }
   /* onRaio() : void{
    }
*/
}
