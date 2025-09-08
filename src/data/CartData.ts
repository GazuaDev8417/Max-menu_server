import Connexion from "./Connexion"
import Cart from "../model/Cart"
import { CartModel, FlavorModel, GroupedProduct, ProductCartModel } from "../model/InterfacesAndTypes"



export default class CartData extends Connexion{
    protected CART_TABLE = 'cart'
    protected FLAVORS_TABLE = 'flavors'
    protected PRODUCTS_TABLE = 'products'
    protected PRODUCTSCART_TABLE = 'products_cart'



    insertInCart = async(cart:Cart):Promise<void>=>{
        try{

            await cart.save()

        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    cartProductById = async(id:string):Promise<CartModel>=>{
        try{
            
            const [product] = await Connexion.con(this.CART_TABLE)
                .where({ id })
                
            return product
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    productsOnOrder = async(client:string):Promise<GroupedProduct[]>=>{
        try{

            const flavors:FlavorModel[] = await Connexion.con(this.CART_TABLE)
                .where({ client })
                
            const products:ProductCartModel[] = await Connexion.con(this.PRODUCTSCART_TABLE)
                .where({ client })
                
            const groupedByProduct: Record<string, FlavorModel[]> = flavors.reduce(
                (acc, item)=>{
                    if(!acc[item.product_id]){
                        acc[item.product_id] = []
                    }
                    acc[item.product_id].push(item)
                    return acc
                },
                {} as Record<string, FlavorModel[]>
            )  

            const groupedWithProductInfo:GroupedProduct[] = products.map(product=>{
                if(product.category === 'bebida'){
                    return{
                        product,
                        items:[]
                    }
                }
                return{
                    product,
                    items: (groupedByProduct[product.product_id] || []).sort((a, b) => a.flavor.localeCompare(b.flavor))
                }                
            }).sort((a, b) => a.product.product.localeCompare(b.product.product))
            
            return groupedWithProductInfo
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    productsOnOrderByClient = async(client:string):Promise<GroupedProduct[]>=>{
        try{

            const flavors:FlavorModel[] = await Connexion.con(this.CART_TABLE)
                .where({ client })
                
            const products:ProductCartModel[] = await Connexion.con(this.PRODUCTSCART_TABLE)
                .where({ client })
                
            const groupedByProduct: Record<string, FlavorModel[]> = flavors.reduce(
                (acc, item)=>{
                    if(!acc[item.product_id]){
                        acc[item.product_id] = []
                    }
                    acc[item.product_id].push(item)
                    return acc
                },
                {} as Record<string, FlavorModel[]>
            )  

            const groupedWithProductInfo:GroupedProduct[] = products.map(product=>{
                if(product.category === 'bebida'){
                    return{
                        product,
                        items:[]
                    }
                }
                return{
                    product,
                    items: (groupedByProduct[product.product_id] || []).sort((a, b) => a.flavor.localeCompare(b.flavor))
                }                
            }).sort((a, b) => a.product.product.localeCompare(b.product.product))
            
            return groupedWithProductInfo
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    /* checkProductsFromCart = async(productId:string, client:string, flavor:string, price:number, max_quantity:number):Promise<CartModel[]>=>{
        try{
            
            const cartProduct = await Connexion.con(this.CART_TABLE)
                .where({ product_id: productId, client, flavor, price, max_quantity })

            return cartProduct
        }catch(e:any){
            throw new Error(e.message || e)
        }
    } */

    updateFlavorQntFromCart = async(
        price:number, flavor:string, product_id:string, 
        client:string, max_quantity:number, step:number, quantity:number
    ):Promise<void>=>{
        try{
            
            const [productFlavor]:CartModel[] = await Connexion.con(this.CART_TABLE)
                .where({ price, flavor, product_id, client, max_quantity, step })
                
            if(!productFlavor) throw new Error('Produto não encontrado')
            
            if(productFlavor.quantity === 1 && quantity === -1){
                await this.removeFlavorFromCart(productFlavor.id) 

                const remainingFlavors = await Connexion.con(this.CART_TABLE)
                    .where({
                        client: productFlavor.client,
                        product_id: productFlavor.product_id
                    })
                
                if(remainingFlavors.length === 0){
                    await Connexion.con(this.PRODUCTSCART_TABLE)
                        .where({
                            client: productFlavor.client,
                            product_id: productFlavor.product_id
                        }).del()
                }
                return               
            }

            const newQuantity = productFlavor.quantity + quantity            
            const [{ total_quantity }] = await Connexion.con(this.CART_TABLE)
                .where({
                    client: productFlavor.client,
                    product_id: productFlavor.product_id,
                    step: productFlavor.step
                }).andWhereNot({ id: productFlavor.id })
                .sum({ total_quantity: 'quantity '})
                
            const totalIfUpdate = Number(total_quantity) + newQuantity
            
            if(totalIfUpdate > productFlavor.max_quantity){
                throw{
                    statusCode: 403,
                    error: new Error(`Você só pode adicionar até ${productFlavor.max_quantity} sabores no geral`)
                }
            }

            await Connexion.con(this.CART_TABLE)
                .update({ quantity: newQuantity, total: productFlavor.price * newQuantity })
                .where({ id: productFlavor.id })

        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    removeFlavorFromCart = async(id:string):Promise<void>=>{
        try{

            await Connexion.con(this.CART_TABLE)
                .del().where({ id })
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    removeFlavorFromCartByClient = async(client:string):Promise<void>=>{
        try{

            await Connexion.con(this.CART_TABLE)
                .del().where({ client })

        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    getCartFromClient = async(client:string):Promise<CartModel[]>=>{
        try{

            const products = await Connexion.con(this.CART_TABLE)
                .where({ client })

            return products
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }
}


