import { UserServiceProvider } from './../user/user.service';
import { Story } from './../../models/story.model';
import { Spotted } from './../../models/spotted.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState, FirebaseApp } from 'angularfire2';
import { BaseService } from '../base.service';
import { Comentario } from '../../models/comentario.model';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

/*
  Generated class for the SpottedProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SpottedServiceProvider extends BaseService {
  private nbObjects: BehaviorSubject<any> = new BehaviorSubject<any>(100);
  spotteds: FirebaseListObservable<Spotted[]>;
  currentSpotted: FirebaseObjectObservable<Spotted>;
  usuarioLikou :boolean;
  solicitacoes: FirebaseListObservable<any[]>;
 
  constructor(public af: AngularFire, public http: Http, @Inject(FirebaseApp) public firebaseApp: any) {
    super();
    this.nbObjects.next(this.nbObjects.getValue() + 2);
    //console.log('Hello SpottedProvider Provider');
 //   this.setSpotteds();
    this.setSolicitacoes();
    //this.dbRef = this.af.database.list(`/spotteds/`);
  //  this.geoFire = new Geofire(this.dbRef.$ref);
  }
  loadMoreObjects() : void {
		this.nbObjects.next(this.nbObjects.getValue() + 100); 
	}
  dbRef:any;

  metodoretornareferencia(){
    return this.af.database.list(`/localizacaoUsuarios`);
  }


createLocationArr(lat:any,lng:any) {
  const location = [lat, lng]
  return location
}
get(userId: string): FirebaseObjectObservable<Spotted> {
  return <FirebaseObjectObservable<Spotted>>this.af.database.object(`/spotteds/${userId}`)
    .catch(this.handleObservableError);
}
private setSpotteds(): void {
  this.af.auth.subscribe(
    (authState: FirebaseAuthState) => {
      if (authState) {
        this.spotteds = <FirebaseListObservable<Spotted[]>>this.af.database.list(`/spotteds`, {
          query: {
            orderByChild: 'timestamp'
          }
        }).map((spotteds: Spotted[]) => {
          return spotteds.reverse();
        }).catch(this.handleObservableError);
      }
    }
  );
}
getLocalization(userId: string): FirebaseObjectObservable<any> {
  return <FirebaseObjectObservable<User>>this.af.database.object(`/localizacaoUsuarios/${userId}`)
    .catch(this.handleObservableError);
}
  getAllSpotteds(): FirebaseListObservable<Spotted[]>{
    return <FirebaseListObservable<Spotted[]>> this.af.database.list(`/spotteds`,{
      query :{
        orderByChild: 'timestamp',
        limitToLast : this.nbObjects
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).map((spotteds: Spotted[]) => {
      return spotteds.reverse();
    })
    .catch(this.handleObservableError); 
    }
    getMySpotteds(userId:string): FirebaseListObservable<Spotted[]>{
      return <FirebaseListObservable<Spotted[]>> this.af.database.list(`/spotteds`,{
        query :{
          orderByChild: 'timestamp',
          limitToLast : this.nbObjects
          //limita o numero de mensagens que ira aparecer na tela
        }
      }).map((spotteds: Spotted[]) => {
        return spotteds.reverse().filter((spotted: Spotted) =>{
          spotted.userId !== userId;
        });
      })
      .catch(this.handleObservableError); 
      }

  





  getSpotteds(userId1: string): FirebaseListObservable<Spotted[]>{
    return <FirebaseListObservable<Spotted[]>> this.af.database.list(`/spotteds/${userId1}`,{
      query :{
        orderByChild: 'timestamp',
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).catch(this.handleObservableError); 
    }
    /*
    create(spotted : Spotted, listMessages : FirebaseListObservable<Spotted[]>,userId:string): firebase.Promise<void>{
      return listMessages.push(spotted).catch(this.handlePromiseError);
    }
*/
    create(spotted: Spotted): firebase.Promise<void> {
      return this.af.database.list(`/spotteds/`).push(spotted).catch(this.handlePromiseError);
    }
    createSolicitacao({materia , professor,userId,timestamp,usuarioCurso,usuarioFaculdade}): firebase.Promise<void> {
     console.log({materia , professor,userId,timestamp,usuarioCurso,usuarioFaculdade});
      return this.af.database.list(`/solicitacoes/`).push({materia:materia,professor:professor,usuarioCurso:usuarioCurso,usuarioFaculdade:usuarioFaculdade,timestamp:timestamp,userId:userId}).catch(this.handlePromiseError);
    }
    darLike(spotted : Spotted,userId:String) : firebase.Promise<void> {

let item = this.retornaObjetoSpottedLike(spotted,userId);
      let itemRef = this.af.database.object(`/spotteds/${spotted.$key}/${userId}`).subscribe(snapshot =>{
        //console.log("qual q eh "+snapshot.usuarioDeuLike);

        if(snapshot.usuarioDeuLike == true){

        }
        else {
          spotted.numLikes++;  
          //console.log("agr tem mais olha ,ja sao "+spotted.numLikes);

        }
      });       

        return this.af.database.object(`/spotteds/${spotted.$key}`).set(spotted).catch(this.handlePromiseError);
    
      
    }
    retornaObjetoSpotted(spotted:Spotted): FirebaseObjectObservable<any>{
      return this.af.database.object(`/spotteds/${spotted.$key}`);
      }     
retornaObjetoSpottedLike(spotted:Spotted,userId :String): FirebaseObjectObservable<any>{
return this.af.database.object(`/spotteds/${spotted.$key}/${userId}`);
}     
atualizaLike(spotted : Spotted,userId:String) : firebase.Promise<void> {
  let item = this.retornaObjetoSpottedLike(spotted,userId);
   return  item.update({ usuarioDeuLike: true });
}


getComentarios(spottedId:string): FirebaseListObservable<Comentario[]>{
  return <FirebaseListObservable<Comentario[]>> this.af.database.list(`/comentarios/${spottedId}`,{
    query :{
      orderByChild: 'timestamp',
      limitToLast : this.nbObjects  //limita o numero de mensagens que ira aparecer na tela
    }
  }).catch(this.handleObservableError); 
  }

comentar(comentario : Comentario,spottedId:string): firebase.Promise<void>{
  return this.af.database.list(`/comentarios/${spottedId}/`).push(comentario).catch(this.handlePromiseError);
}
deletarComentario(id:string): firebase.Promise<void>{
return this.af.database.object(`comentarios/${id}`).remove().catch(this.handlePromiseError);
}
//  create(spotted: Spotted, userId: string): firebase.Promise<void> {
 
    //return this.af.database.object(`/chats/${userId1}/${userId2}`).set(chat).catch(this.handlePromiseError);

   //    return this.af.database.object(`/spotteds/${userId}`).set(spotted).catch(this.handlePromiseError);
 // }







edit(spotted:{titulo:string,conteudo:string,photo:string}) : firebase.Promise<void>{
  return this.currentSpotted.update(spotted).catch(this.handlePromiseError);
}
delete(spotted:Spotted/*,userId:string*/) : firebase.Promise<void>{
  return this.af.database.object(`/spotteds/${spotted.$key}`).remove().catch(this.handlePromiseError);
}
deleteComId(spotted:string/*,userId:string*/) : firebase.Promise<void>{
  return this.af.database.object(`/spotteds/${spotted}`).remove().catch(this.handlePromiseError);
}
deleteSolicitacao(key:string/*,userId:string*/) : firebase.Promise<void>{
  return this.af.database.object(`/solicitacoes/${key}`).remove().catch(this.handlePromiseError);
}
uploadPhoto(file:File,userId:string) :firebase.storage.UploadTask {
  return this.firebaseApp.storage().ref().child(`/spotteds/${userId}`).put(file);
}

  /*
  getDeepSpotted(userId1: string): FirebaseObjectObservable<Spotted> {
    return <FirebaseObjectObservable<Spotted>>this.af.database
      .object(`/spotteds/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }
  */

  private setSolicitacoes(): void {
    this.af.auth.subscribe(
      (authState: FirebaseAuthState) => {
        if (authState) {
          this.solicitacoes = <FirebaseListObservable<any[]>>this.af.database.list(`/solicitacoes`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((solicitacoes: any[]) => {
            return solicitacoes.reverse();
          }).catch(this.handleObservableError);
        }
      }
    );
  }
  updatePhoto(spotted: FirebaseObjectObservable<Spotted>, spottedPhoto: string, recipientUserPhoto: string): firebase.Promise<boolean> {
    if (spottedPhoto != recipientUserPhoto) {
      return spotted.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }


}

