import { Request, Response } from "express"
import ClientBusiness from "../business/ClientBusiness"
import { UserModel } from "../model/InterfacesAndTypes"





export default class ClientController{
    constructor(
        private clientBusiness:ClientBusiness
    ){}

    /* generateUserId = (req:Request, res:Response): void => {
        const userId = crypto.randomUUID()
        const token = new Authentication().token(userId)

        res.status(200).send(token)
    } */

    /* clientByPhone = async(req:Request, res:Response):Promise<void>=>{
        try{

            const client = await this.clientBusiness.clientByPhone(req)

            res.status(200).send(client)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */

    /* registClient = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.clientBusiness.registClient(req)

            res.status(201).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    } */

    registUser = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.clientBusiness.registUser(req)

            res.status(201).send(token)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    loginUser = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.clientBusiness.loginUser(req)

            res.status(200).send(token)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    userById = async(req:Request, res:Response):Promise<void>=>{
        try{
            const user = await this.clientBusiness.userById(req)

            res.status(200).send(user)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    updateAddress = async(req:Request, res:Response):Promise<void>=>{
        try{
            await this.clientBusiness.updateAddress(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    clientLastOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            const lastorder = await this.clientBusiness.clientLastOrder()

            res.status(200).send(lastorder)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    clientsWithOrders = async(req:Request, res:Response):Promise<void>=>{
        try{

            const groupedOrders = await this.clientBusiness.clientsWithOrders()

            res.status(200).send(groupedOrders)
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    removeClientOrder = async(req:Request, res:Response):Promise<void>=>{
        try{

            const id = req.params.id

            await this.clientBusiness.removeClientOrder(id)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    deleteAccount = async(req:Request, res:Response):Promise<void>=>{
        try{

            await this.clientBusiness.deleteAccount(req)

            res.status(200).end()
        }catch(e:any){
            let statusCode = e.statusCode || 400
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }
}