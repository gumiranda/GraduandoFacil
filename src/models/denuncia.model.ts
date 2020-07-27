export class Denuncia {
    public $key : string;
    constructor(public motivo: string,
        public denunciante: string,
        public denunciado: string,
        public idSpotted:string,
        public idComentario:string,
        public nomeDenunciado: string,
        public timestamp:any,
        public conteudo:string
        ) { }

}