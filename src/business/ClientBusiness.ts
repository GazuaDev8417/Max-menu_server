import { Request } from "express"
import Client from "../model/Client"
import AdmUser from "../model/AdmUser"
import ClientData from "../data/ClientData"
import Authentication from "../services/Authentication"
import { ClientModel, Order } from "../model/InterfacesAndTypes"
import { v4 } from "uuid"



export default class ClientBusiness{
    constructor(
        private clientData:ClientData
    ){}


    registClient = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const id = new Authentication().tokenData(token as string).userId
        const { pedido } = req.body
        
        const newClient = new Client(v4(), pedido)
        
        await this.clientData.registClient(newClient)
        /* HÁ UM COMPLEMENTO AQUI QUE PRECISA SER LEMBRADO */
    }

    registUser = async(req:Request):Promise<string>=>{
        const { user, phone, password, role } = req.body
        
        const id = v4()
        const token = new Authentication().token(id)
        const hash = new Authentication().hash(password)
        const newUser = new AdmUser(
            id,
            user,
            phone,
            hash,
            role
        )

        await this.clientData.registUser(newUser)

        return token
    }
    
    loginUser = async(req:Request):Promise<string>=>{
        const { phone, password } = req.body
        
        if(!phone || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        const user = await this.clientData.userByPhone(phone)        
        if(!user){
            throw{
                statusCode: 404,
                error: new Error('Usuário não encontrado, verifique suas credenciais')
            }
        }

        const compare = new Authentication().compare(password, user.password)        
        if(!compare){
            throw{
                statusCode: 404,
                error: new Error('Usuário não encontrado, verifique suas credenciais')
            }
        }

        const token = new Authentication().token(user.id)
        return token        
    }

    clientByPhone = async(req:Request):Promise<ClientModel>=>{
        const { phone } = req.body

        if(!phone){
            throw{
                statusCode: 401,
                error: new Error('Insira o número de telefone')
            }
        }

        const client = await this.clientData.clientByPhone(phone)

        if(!client){
            throw{
                statusCode: 404,
                error: new Error('Cliente não encontrado')
            }
        }

        return client
    }

    clientLastOrder = async():Promise<number>=>{
        const lastOrder = await this.clientData.clientLastOrder()

        return lastOrder
    }

    clientsWithOrders = async():Promise<Order[]>=>{
        const groupedOrders = await this.clientData.clientsWithOrders()
        
        return groupedOrders
    }
}
