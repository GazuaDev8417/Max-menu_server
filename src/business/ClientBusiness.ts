import { Request } from "express"
//import Client from "../model/Client"
import AdmUser from "../model/AdmUser"
import ClientData from "../data/ClientData"
import Authentication from "../services/Authentication"
import { Order, UserModel } from "../model/InterfacesAndTypes"
import { v4 } from "uuid"



export default class ClientBusiness{
    constructor(
        private clientData:ClientData
    ){}


    /* registClient = async(req:Request):Promise<void>=>{
        const token = req.headers.authorization
        const id = new Authentication().tokenData(token as string).userId
        const { pedido } = req.body
        
        const newClient = new Client(v4(), pedido)
        
        await this.clientData.registClient(newClient)
        HÁ UM COMPLEMENTO AQUI QUE PRECISA SER LEMBRADO
    } */

    registUser = async(req:Request):Promise<string>=>{
        const { user, email, phone, password, role } = req.body
        
        const id = v4()
        const token = new Authentication().token(id)
        const hash = new Authentication().hash(password)
        const newUser = new AdmUser(
            id,
            user,
            email,
            phone,
            hash,
            role
        )

        const existingUser = await this.clientData.userByPhoneAndEmail(phone, email)
        if(existingUser){
            throw{
                statuCode: 403,
                error: new Error('Cliente já cadastrado')
            }
        }

        await this.clientData.registUser(newUser)

        return token
    }
    
    loginUser = async(req:Request):Promise<string>=>{
        const { email, password } = req.body
        
        if(!email || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        const user = await this.clientData.userByEmail(email)       
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

    userById = async(req:Request):Promise<UserModel>=>{
        const user = await new Authentication().authToken(req)

        if(!user){
            throw{
                statusCode: 404,
                error: new Error('Cliente não encontrado')
            }
        }

        return user
    }

    updateAddress = async(req:Request):Promise<void>=>{
        const user = await new Authentication().authToken(req)
        const { street, cep, neighbourhood, complement } = req.body

        if(!street || !cep || !neighbourhood || !complement){
            throw{
                statusCode: 401,
                error: new Error('Preencha todos os campos')
            }
        }

        await this.clientData.updateAddress(
            street, cep, neighbourhood, complement, user.id
        )
    }

    /* clientByPhone = async(req:Request):Promise<ClientModel>=>{
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
    } */

    clientLastOrder = async():Promise<number>=>{
        const lastOrder = await this.clientData.clientLastOrder()

        return lastOrder
    }

    clientsWithOrders = async():Promise<Order[]>=>{
        const groupedOrders = await this.clientData.clientsWithOrders()
        
        return groupedOrders
    }

    removeClientOrder = async(id:string):Promise<void>=>{
        await this.clientData.removeClientOrder(id)
    }

    deleteAccount = async(req:Request):Promise<void>=>{
        const user = await new Authentication().authToken(req)
        
        await this.clientData.deleteAccount(user.id) 
    }
}
