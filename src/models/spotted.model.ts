export class Spotted {
    public $key : string;
    public lastComentario?: string;

    constructor(
        public faculdade:string,
        public curso:string,
        public materia: string,
        public professor:string,
        public dificuldadeMateria :string,
        public dificuldadeProfessor:string,
        public conteudo:string,
        public photo: string,
        public userId : string,
        public userNome:string,
        public userPhoto:string,
        public numComentarios : number,
        public numLikes : number,
        public timestamp : any
       ) { }

}