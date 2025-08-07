import Connexion from "../data/Connexion"




export default class Flavor extends Connexion{
    protected FLAVOR_TABLE = 'flavors'
    
        constructor(
            private id:string,
            private flavor:string,
            private price:number,
            private ingredients:string,
            private max_quantity:string,
            private total:number,
            private product_id:string
            
        ){ super() }
    
        save = async()=>{
            try{
                await Connexion.con(this.FLAVOR_TABLE).insert({
                    id: this.id,
                    flavor: this.flavor,
                    price: this.price,
                    ingredients: this.ingredients,
                    max_quantity: this.max_quantity,
                    total: this.total,
                    product_id: this.product_id
                })
            }catch(e){
                throw new Error(`Erro ao registrar produto: ${e}`)
            }
        }
}