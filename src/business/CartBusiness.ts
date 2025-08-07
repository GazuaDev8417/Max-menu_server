import { Request } from "express"
import Cart from "../model/Cart"
import ProductCart from "../model/Product_cart"
import CartData from "../data/CartData"
import ProductData from "../data/ProductData"
import { ProductCartModel, GroupedProduct, CartModel, ProductModel } from "../model/InterfacesAndTypes"
import { v4 } from "uuid"
import Authentication from "../services/Authentication"



export default class CartBusiness{
    constructor(
        private cartData:CartData,
        private productData:ProductData
    ){}


    insertInCart = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const client = new Authentication().tokenData(token as string).userId
        const { price, quantity, flavor, productId, max_quantity, step } = req.body
        const convertedPrice = Number(price)
        
        if(!productId){
            throw{
                statusCode: 401,
                error: new Error('Identificadores do produto não detectado')
            }
        }

        const product:ProductCartModel | null = await this.productData
            .getProductCartByClient(client, productId)
              
        if(!product){
            const productToCart:ProductModel = await this.productData.getProductById(productId)
            const newCartProd = new ProductCart(
                v4(),
                productToCart.product,
                productToCart.price,
                productToCart.quantity,
                productToCart.quantity * productToCart.price,
                client,
                productId,
                productToCart.category
            )
            await this.productData.insertInProductCart(newCartProd)
        }

        const newCart = new Cart(
            v4(),
            convertedPrice,
            quantity === 0 ? 1 : quantity,
            flavor,
            quantity * price ,
            productId,
            client,
            max_quantity,
            step
        )
         
        await this.cartData.insertInCart(newCart)
    }

    checkProductsFromCart = async(req:Request):Promise<CartModel>=>{
        const { client, productId, flavor, price, max_quantity } = req.body
        const [product] = await this.cartData.checkProductsFromCart(productId, client, flavor, price, max_quantity) 
        
        if(!product){
            throw{
                statusCode: 404,
                error: new Error('Produto não encontrado no carrinho')
            }
        }

        return product
    }

    productsOnOrder = async(req:Request):Promise<GroupedProduct[]>=>{
        const token = req.headers.authorization
        const client = new Authentication().tokenData(token as string).userId
        const products = await this.cartData.productsOnOrder(client)

        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error(
                    'Seu carrinho ainda está vazio. Sinta-se à vontade para escolher seus produtos e fazer seus pedidos'
                )
            }
        }

        return products
    }

    updateFlavorQntFromCart = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const client = new Authentication().tokenData(token as string).userId
        const {
            price, flavor, product_id, 
            max_quantity, step, quantity
        } = req.body
        if(
            !flavor || !product_id || max_quantity === undefined 
            || step === undefined || quantity === undefined
        ){
            throw{
                statusCode: 403,
                error: new Error('Algum(ns) dado(s) da requisição está(ão) penddente(s)')
            }
        }
        
        const convertedPrice = Number(price)
        
        await this.cartData.updateFlavorQntFromCart(
            convertedPrice, flavor, product_id, 
            client, max_quantity, step, quantity
        )
    }

    cartProductById = async(req:Request):Promise<CartModel>=>{
        const product = await this.cartData.cartProductById(req.params.id)
        
        if(!product){
            throw{
                statusCode: 404,
                error: new Error('Produto não encontrado')
            }
        }

        return product
    }

    removeFlavorFromCart = async(req:Request):Promise<void>=>{
        const proudct = await this.cartData.cartProductById(req.params.id)

        if(!proudct){
            throw{
                statusCode: 404,
                error: new Error('Produto não consta no carrinho')
            }
        }

        await this.cartData.removeFlavorFromCart(req.params.id)
    }

    removeFlavorFromCartByClient = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const clientId = new Authentication().tokenData(token as string).userId
        const products:CartModel[] = await this.cartData.getCartFromClient(clientId)

        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Carrinho não consta produtos desse cliente')
            }
        }

        await this.cartData.removeFlavorFromCartByClient(clientId)
    }

    removeProductFromCartByClient = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const clientId = new Authentication().tokenData(token as string).userId
        const products:ProductCartModel[] = await this.productData.getCartByClient(clientId)

        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Carrinho não consta produtos desse cliente')
            }
        }

        await this.productData.removeProductFromCartByClient(clientId)
    }

    getCartFromClient = async(req:Request):Promise<CartModel[]>=>{ 
        const token = req.headers.authorization
        const id = new Authentication().tokenData(token as string).userId
        const products = await this.cartData.getCartFromClient(id)

        return products
    }
}
