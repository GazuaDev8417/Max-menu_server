import { Request } from "express"
import axios from "axios"
import Cart from "../model/Cart"
import ProductCart from "../model/Product_cart"
import CartData from "../data/CartData"
import ProductData from "../data/ProductData"
import moment from "moment-timezone"
import { ProductCartModel, GroupedProduct, CartModel, ProductModel } from "../model/InterfacesAndTypes"
import { v4 } from "uuid"
import Authentication from "../services/Authentication"
import { config } from "dotenv"

config()


export default class CartBusiness{
    constructor(
        private cartData:CartData,
        private productData:ProductData
    ){}


    insertInCart = async(req:Request):Promise<void>=>{
        const client = await new Authentication().authToken(req)
        const { price, quantity, flavor, productId, momentString, max_quantity, step } = req.body
        const localMoment = moment.utc(momentString).tz("America/Sao_Paulo").format('DD/MM/YYYY [às] HH:mm')

        const convertedPrice = Number(price)
        
        if(!productId){
            throw{
                statusCode: 401,
                error: new Error('Identificadores do produto não detectado')
            }
        }

        const product:ProductCartModel | null = await this.productData
            .getProductCartByClient(client.id, productId)
              
        const productToCart:ProductModel = await this.productData.getProductById(productId)
        if(!product){
            const newCartProd = new ProductCart(
                v4(),
                productToCart.product,
                productToCart.price,
                productToCart.quantity,
                productToCart.quantity * productToCart.price,
                client.id,
                productId,
                productToCart.category,
                localMoment,
                'Pendente'
            )
            await this.productData.insertInProductCart(newCartProd)
        }

        if(productToCart.category === 'bebida') return

        const newCart = new Cart(
            v4(),
            convertedPrice,
            quantity === 0 ? 1 : quantity,
            flavor,
            quantity * price ,
            productId,
            client.id,
            max_quantity,
            step,
            localMoment,
            'Pendente'
        )
         
        await this.cartData.insertInCart(newCart)
    }

    /* checkProductsFromCart = async(req:Request):Promise<CartModel>=>{
        const { client, productId, flavor, price, max_quantity } = req.body
        const [product] = await this.cartData.checkProductsFromCart(productId, client, flavor, price, max_quantity) 
        
        if(!product){
            throw{
                statusCode: 404,
                error: new Error('Produto não encontrado no carrinho')
            }
        }

        return product
    } */

    productsOnOrder = async(req:Request):Promise<GroupedProduct[]>=>{
        const client = (await new Authentication().authToken(req)).id
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

    /* finishOrderProducts = async(req:Request):Promise<GroupedProduct[]>=>{
        const client = (await new Authentication().authToken(req)).id
        const products = await this.cartData.finishOrderProducts(client)

        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error(
                    'Seu carrinho está vazio'
                )
            }
        }

        return products
    } */

    productsOnOrderByClient = async(req:Request):Promise<GroupedProduct[]>=>{
        const user = await new Authentication().authToken(req)

        if(user.role !== 'ADM'){
            throw{
                statusCode: 401,
                error: new Error('Somente para usuário administrador')
            }
        }

        const products = await this.cartData.productsOnOrderByClient(req.params.id)

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
        const client = (await new Authentication().authToken(req)).id
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

    /* removeFlavorFromCart = async(req:Request):Promise<void>=>{
        const proudct = await this.cartData.cartProductById(req.params.id)

        if(!proudct){
            throw{
                statusCode: 404,
                error: new Error('Produto não consta no carrinho')
            }
        }

        await this.cartData.removeFlavorFromCart(req.params.id)
    } */

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

    /* removeProductFromCartByClient = async(req:Request):Promise<void>=>{
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
    } */

    /* getCartFromClient = async(req:Request):Promise<CartModel[]>=>{ 
        const token = req.headers.authorization
        const id = new Authentication().tokenData(token as string).userId
        const products = await this.cartData.getCartFromClient(id)

        return products
    } */

    pay = async(req:Request)=>{
        try{
            const { paymentMethodId, email, token, items } = req.body
            const orderId = `${email}-${Date.now()}`
            const transaction_amount = items.reduce(
                (acc: number, item: any) => acc + (item.unit_price * item.quantity),
                0
            )

            const transaction_amount_fixed = Number(transaction_amount).toFixed(2)
            const body:any = {
                transaction_amount: Number(transaction_amount_fixed),
                description: 'Compra no app',
                payment_method_id: paymentMethodId,
                payer: { email },
                external_reference: orderId
            }


            if(['visa', 'master', 'amex'].includes(paymentMethodId)){
                body.token = token
                body.installments = 1
            }else{
                delete body.installments
            }

            const response = await axios.post(
                'https://api.mercadopago.com/v1/payments',
                body,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN_TP}`,
                        'X-Idempotency-Key': v4()
                    }
                }
            )

            return response
        }catch(e:any){
            if(axios.isAxiosError(e)){
                throw{
                    statusCode: e.response?.status || 500,
                    error: e.response?.data || e.message
                }
            }

            throw{
                statusCode: e.statusCode || 500,
                error: e.message || 'Erro interno ao processar pagamento'
            }
        }     
    }

    paymentStatus = async(req:Request):Promise<string>=>{
        const { id } = req.params

        try{
            
            const res = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN_TP}` }
            })

            const data = await res.data
            return data.status                       
        }catch(e:any){
            if(e.response){
                return e.response.status
            }else{
                throw new Error(e.message)
            }
        }
    }
}
