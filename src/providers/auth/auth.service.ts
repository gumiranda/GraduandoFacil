import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth,AngularFire, FirebaseAuthState } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { BaseService } from '../base.service';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';

@Injectable()
export class AuthServiceProvider extends BaseService {
authenticatedref  = this.auth;
userId: string; // current user uid
mouseEvents:Subscription;
timer:Subscription;
user;
emailVerified;
  constructor(public auth: AngularFireAuth, public af: AngularFire,public http: Http) {
    super();
    this.auth
            .do(user => {
              this.user = user;
              if (user) {
                 this.userId = user.uid
                 this.emailVerified = user.auth.emailVerified;
                 this.updateOnConnect()
                 this.updateOnDisconnect()
                 this.updateOnIdle()
              }
        

            })
        .subscribe();
    //console.log('Hello AuthProvider Provider');
  }
  getEmailVerified() {
    return this.emailVerified;
  }
  getUserId() {
    return this.userId;
  }
  private updateOnIdle(){
    this.mouseEvents = Observable.fromEvent(document,'mousemove').throttleTime(2000)
   .do(()=>{
     this.updateStatus('online')
     this.resetTimer()
   }).subscribe() 
  }
  private resetTimer(){
    if(this.timer) this.timer.unsubscribe()

    this.timer = Observable.timer(5000).do(()=>{
      this.updateStatus('away')
    }).subscribe()

  }
  createAuthUser(user: { email: string, password: string }): firebase.Promise<FirebaseAuthState> {
    
    return this.auth.createUser(user).catch(this.handlePromiseError);
  }

  emailVerification()
  {
    //this.authState.auth.getAuth().auth.sendEmailVerification();
    //firebase.auth().currentUser.sendEmailVerification();
    this.auth.getAuth().auth.sendEmailVerification().then(function() 
    {
      firebase.auth().currentUser.sendEmailVerification();
      //this.sendEmailVerification();
      //let user:any = firebase.auth().currentUser;
      //this.user.sendEmailVerification();
    }).catch(function(error) 
    {
      // An error happened.
    });
  }
  registerSuccess;
  sendEmailVerification() {
    this.auth.subscribe(user => {
      user.auth.sendEmailVerification()
        .then(() => {
          console.log('email sent');
          this.registerSuccess = 'Check your email for a verification email.';
        });
    });
  }

 
signinWithEmail(user:{email:string,password:string}): firebase.Promise<boolean>{
return this.auth.login(user).then(
  (authState : FirebaseAuthState) => {
    return authState != null;
  }).catch(this.handlePromiseError);
}
facebookLogin(fb :Facebook): Promise<any> {
  return fb.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 
          console.log("Firebase success: " + JSON.stringify(success)); 
        });

    }).catch((error) => { console.log(error) });
}

logout() : Promise<void>{
  this.updateStatus('offline')
  this.mouseEvents.unsubscribe()
  this.timer.unsubscribe()
  return this.auth.logout();
}
vazar():  Promise<void>{
  return this.auth.logout();
}
get authenticated(): Promise<boolean> {
  return new Promise(
    (resolve,reject) => {
      //console.log(this.auth);
      this.auth
      .first().
      subscribe((authState : FirebaseAuthState)=>{
      (authState) ? resolve(true): reject(false);
    });
  });
}
private updateOnConnect() {
  return this.af.database.object('.info/connected')
                .do(connected => {
                    let status = connected.$value ? 'online' : 'offline'
                    this.updateStatus(status)
                })
                .subscribe()
}
private updateStatus(status: string) {
  if (!this.userId) return
  this.af.database.object(`users/` + this.userId).update({ status: status })
}

private updateOnDisconnect() {
firebase.database().ref().child('users/'+this.userId).onDisconnect().update({status:'offline'})
/*
  this.af.database.object(`users/${this.userId}`)
          .onDisconnect()
          .update({status: 'offline'})
*/
        }

}
