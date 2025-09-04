import { Request, Response } from 'express'
import CartBusiness from '../business/CartBusiness'





export default class CartController{
    constructor(
        private cartBusiness:CartBusiness
    ){}


    insertInCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.cartBusiness.insertInCart(req)

            res.status(201).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    checkProductsFromCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.cartBusiness.checkProductsFromCart(req)

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    cartProductById = async(req:Request, res:Response):Promise<void>=>{
        try{

            const product = await this.cartBusiness.cartProductById(req)

            res.status(200).send(product)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    productsOnOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.cartBusiness.productsOnOrder(req)

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    updateFlavorQntFromCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.cartBusiness.updateFlavorQntFromCart(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    removeFlavorFromCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.cartBusiness.removeFlavorFromCart(req)

        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    getCartFromClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.cartBusiness.getCartFromClient(req)

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    /* pay = async(req:Request, res:Response):Promise<void>=>{
        try{
            const response = await this.cartBusiness.pay(req)
            res.status(200).json({
                orderId: response.data.external_reference,
                status: response.data.status,
                id: response.data.id,
                payment_type: response.data.payment_type_id,
                qr_code: response.data.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
                qr_code_link: response.data.point_of_interaction?.transaction_data?.ticket_url
                            || response.data.point_of_interaction?.transaction_data?.qr_code_link
            })
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */
}