
export class api{


    places = [
         {
             name:"PONTO A",
             lat:"-9.3680557",
             lng:"-36.2621896",
         },
         {
             name:"PONTO B",
             lat:"-9.6130092",
             lng:"-36.5101800",
         }
    ]


    getPoints():Promise<any>{
       return new Promise((success)=>{
            success(this.places);
       })
    }


}