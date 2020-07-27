
export class Notificacao{
    myRenderer;
    public $key : string;

    constructor(public userId:string,public titulo : string,public senderKey:string,public senderPhoto:string,public texto:string,public tipo:number,public lida:boolean,public timestamp : any){
//      userid,titulo,texto,tipo,lida,timestamp
        
    }
}