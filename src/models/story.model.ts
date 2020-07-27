export class Story {
    public $key : string;

    constructor(
        public photo: string,
        public userId : string,
        public userNome:string,
        public userPhoto:string,
        public timestamp : any
       ) { }

}