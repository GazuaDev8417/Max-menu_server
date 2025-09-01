import { Request, Response } from 'express'
import ProductBusiness from '../business/ProductBusiness'



export default class ProductController{
    constructor(
        private productBusiness:ProductBusiness
    ){}

    registProducts = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.registProducts(req)

            res.status(201).send('Produto registrado com sucesso')
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


    insertInProductCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.insertInProductCart(req)

            res.status(201).send('Produto inserido no carrinho')
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }


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


    removeProductFromCart = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.removeProductFromCart(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).json({ message: message || e.sqlMessage })
        }
    }

    removeProductFromCartByClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.removeProductFromCartByClient(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).json({ message: message || e.sqlMessage })
        }
    }


    /* flavorsByProductStep2 = async(req:Request, res:Response):Promise<void>=>{
        try{

            const flavors = await this.productBusiness.flavorsByProductStep2(req)

            res.status(200).send(flavors)
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */


    /* updateFlavorsQntStep2 = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.productBusiness.updateFlavorsQntStep2(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400    
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */


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
    
}