import Connexion from "../data/Connexion"



export default class Product extends Connexion{
    protected PRODUCT_TABLE = 'products'

    constructor(
        private id:string,
        private product:string,
        private description:string,
        private category:string,
        private price:number,
        private quantity:number,
        private total:number
    ){ super() }

    save = async()=>{
        try{
            await Connexion.con(this.PRODUCT_TABLE).insert({
                id: this.id,
                product: this.product.toUpperCase(),
                description: this.description,
                category: this.category,
                price: this.price,
                quantity: this.quantity,
                total: this.total
            })
        }catch(e){
            throw new Error(`Erro ao registrar produto: ${e}`)
        }
    }
}