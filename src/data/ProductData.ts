import Connexion from "./Connexion"
//import Product from "../model/Product"
import Flavor from "../model/Flavor"
import { ProductModel, FlavorModel, ProductCartModel } from "../model/InterfacesAndTypes"
import ProductCart from "../model/Product_cart"



export default class ProductData extends Connexion{
    protected PRODUCT_TABLE = 'products'
    protected PRODUCTCART_TABLE = 'products_cart'
    protected FLAVORS_TABLE = 'flavors'
    protected CART_TABLE = 'cart'
    

    /* registProducts = async(product:Product):Promise<void>=>{
        try{
            
            await product.save()

        }catch(e:any){
            throw new Error(`Erro ao registrar produto: ${e}`)
        }
    } */

    insertInProductCart = async(product:ProductCart):Promise<void>=>{
        try{
            
            await product.save()

        }catch(e:any){
            throw new Error(`Erro ao adicionar produto no carrinho: ${e}`)
        }
    }

    getProductCartByClient = async(client:string, product_id:string):Promise<ProductCartModel | null>=>{
        try{

            const [product] = await Connexion.con(this.PRODUCTCART_TABLE)
                .where({ client, product_id })
           

            return product || null
        }catch(e:any){
            throw new Error(e.message || 'Erro no servidor')
        }
    }

    getCartByClient = async(client:string):Promise<ProductCartModel[]>=>{
        try{

            const products = await Connexion.con(this.PRODUCTCART_TABLE)
                .where({ client })
           

            return products
        }catch(e:any){
            throw new Error(e.message || 'Erro no servidor')
        }
    }

    getProductCartById = async(id:string):Promise<ProductCartModel>=>{
        try{

            const [product] = await Connexion.con(this.PRODUCTCART_TABLE)
                .where({ id })
            if(!product){
                throw{
                    statusCode: 404,
                    error: new Error('Produto não encontrado')
                }
            }

            return product
        }catch(e:any){
            throw new Error(`Erro ao buscar produto no carrinho: ${e}`) 
        }
    }


    insertFlavor = async(flavor:Flavor):Promise<void>=>{
        try{
            
            await flavor.save()

        }catch(e:any){
            throw new Error(`Erro ao registrar produto: ${e}`)
        }
    }

    
    getProductById = async(id:string):Promise<ProductModel>=>{
        try{

            const [product] = await Connexion.con(this.PRODUCT_TABLE)
                .where({ id })

            return product
        }catch(e:any){
            throw new Error(`Erro ao buscar produto: ${e}`)
        }
    }


    getProductByName = async(productName:string):Promise<ProductModel>=>{
        try{
            
            const [product] = await Connexion.con(this.PRODUCT_TABLE)
                .where({ product: productName.toUpperCase() })
            return product
        }catch(e:any){
            throw new Error(`Erro ao buscar produto: ${e}`)
        }
    }


    getFlavorById = async(flavorId:string):Promise<FlavorModel>=>{
        try{

            const [flavor] = await Connexion.con(this.FLAVORS_TABLE)
                .where({ id: flavorId })
                
            return flavor
        }catch(e:any){
            throw new Error(`Erro ao buscar produto: ${e}`)
        }
    }


    flavorsByProduct = async(productId:string, step:number/* , client:string */):Promise<{flavors: FlavorModel[], maxStep: number, total_quantity:number }>=>{
        try{
            
            const flavors = await Connexion.con(`${this.FLAVORS_TABLE} as f`)
                .leftJoin(`${this.CART_TABLE} as c`, (join) =>{
                    join.on('c.flavor', '=', 'f.flavor')
                        .andOnVal('c.step', '=', step)
                        /* .andOnVal('c.client', '=', client) */
                        .andOn('c.product_id', '=', 'f.product_id')
                }).where('f.product_id', productId)
                    .andWhere('f.step', step)
                    .orderBy('f.flavor', 'asc')
                    .select(
                        'f.*',
                        Connexion.con.raw('COALESCE(c.quantity, 0) as quantity'),
                        'f.product_id'
                    )
                    
            const [{ maxStep }] = await Connexion.con(this.FLAVORS_TABLE)
                .where({ product_id: productId })
                .max({ maxStep: 'step' })
                
            const [{ total_quantity }] = await Connexion.con(this.FLAVORS_TABLE)
                .where({ product_id: productId })
                .sum({ total_quantity: 'quantity' }) 
                
            return {
                flavors, 
                maxStep: Number(maxStep) || 0,
                total_quantity: Number(total_quantity)
            }
        }catch(e:any){
            throw new Error(`Erro ao buscar sabores: ${e}`)
        }
    }

    removeProductFromCart = async(id:string):Promise<void>=>{
        try{

            await Connexion.con(this.PRODUCTCART_TABLE).del()
                .where({ id })
        }catch(e:any){
            throw new Error(`Erro ao remover produto: ${e}`)
        }
    }

    /* removeProductFromCartByClient = async(client:string):Promise<void>=>{
        try{

            await Connexion.con(this.PRODUCTCART_TABLE).del()
                .where({ client })
            await Connexion.con(this.CART_TABLE).del()
                .where({ client })
                
        }catch(e:any){
            throw new Error(`Erro ao remover produto: ${e}`)
        }
    } */

    updateProductQntFromCart = async(id:string, quantity:number, product:ProductCartModel):Promise<void>=>{
        try{
            
            if(product.quantity === 1 && quantity === -1){
                await this.removeProductFromCart(id)
                return
            }

            const newQuantity = product.quantity + quantity

            await Connexion.con(this.PRODUCTCART_TABLE).update({
                quantity: newQuantity, total: product.price * newQuantity
            }).where({ id })
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }


    verifyMaxQnt = async(productId:string, client:string):Promise<{ maxStep:number, total_quantity:number }>=>{
        try{
            const [{ maxStep }] = await Connexion.con(this.FLAVORS_TABLE)
                .where({ product_id: productId })
                .max({ maxStep: 'step' })
            
            const [{ total_quantity }] = await Connexion.con(this.CART_TABLE)
                .where({ product_id: productId, step: 1, client })
                .sum({ total_quantity: 'quantity' })
                
            return { 
                maxStep: Number(maxStep) || 0,
                total_quantity: Number(total_quantity)
            }
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }


    getAllProducts = async():Promise<ProductModel[]>=>{
        try{

            const products = await Connexion.con(this.PRODUCT_TABLE)

            return products
        }catch(e:any){
            throw new Error(`Erro ao buscar produtos: ${e}`)
        }
    }
}