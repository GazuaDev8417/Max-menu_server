import { Request, Response } from 'express'
import ProductBusiness from '../business/ProductBusiness'



export default class ProductController{
    constructor(
        private productBusiness:ProductBusiness
    ){}
    

    getProductById = async(req:Request, res:Response):Promise<void>=>{
        try{

            const product = await this.productBusiness.getProductById(req)

            res.status(200).send(product)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    flavorsByProduct = async(req:Request, res:Response):Promise<void>=>{
        try{
            
            const flavors = await this.productBusiness.flavorsByProduct(req)

            res.status(200).send(flavors)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    updateProductQntFromCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.updateProductQntFromCart(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).json({ message: message || e.sqlMessage })
        }
    }


    verifyMaxQnt = async(req:Request, res:Response):Promise<void>=>{
        try{
            const maxStepAndQnt = await this.productBusiness.verifyMaxQnt(req)

            res.status(200).send(maxStepAndQnt)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    
    getAllProducts = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.productBusiness.getAllProducts()

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    getCartByClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            const products = await this.productBusiness.getCartByClient(req)

            res.status(200).send(products)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    deleteOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.deleteOrder(req)

            res.status(200).send('Pedido excluído com sucesso')
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }    
}