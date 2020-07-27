export class Bloqueado {
    public $key : string;
    constructor(
        public bloqueante: string,
        public bloqueado: string,
        public nomeBloqueado: string,
        public timestamp:any,
        public flagBloqueou:number//via dupla, se tiver 1 bloqueou,se tiver 2 foi bloqueado
        ) { }

}