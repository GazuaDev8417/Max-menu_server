import Connexion from "../data/Connexion"



export default class Cart extends Connexion{
    protected CART_TABLE = 'cart'
    
    constructor(
        private id:string,
        private price:number,
        private quantity:number,
        private flavor:string,
        private total:number | undefined | null,
        private product_id:string,
        private client:string,
        private max_quantity:number,
        private step:number,
        private moment:string
    ){ super() }

    save = async()=>{
        try{
            await Connexion.con(this.CART_TABLE).insert({
                id: this.id,
                price: this.price,
                quantity: this.quantity,
                flavor: this.flavor,
                total: this.total,
                product_id: this.product_id,
                client: this.client,
                max_quantity: this.max_quantity,
                step: this.step,
                moment: this.moment
            })
        }catch(e){
            throw new Error(`Erro ao registrar produto: ${e}`)
        }
    }
}