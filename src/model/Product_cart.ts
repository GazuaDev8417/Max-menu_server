import Connexion from "../data/Connexion"



export default class ProductCart extends Connexion{
    protected PRODUCTCART_TABLE = 'products_cart'

    constructor(
        private id:string,
        private product:string,
        private price:number,
        private quantity:number,
        private total:number,
        private client:string,
        private product_id:string,
        private category:string,
        private moment:string,
    ){ super() }

    save = async()=>{
        try{
            await Connexion.con(this.PRODUCTCART_TABLE).insert({
                id: this.id,
                product: this.product.toUpperCase(),
                price: this.price,
                quantity: this.quantity,
                total: this.total,
                client: this.client,
                product_id: this.product_id,
                category: this.category,
                moment: this.moment
            })
        }catch(e){
            throw new Error(`Erro ao adicionar produto no carrinho: ${e}`)
        }
    }
}