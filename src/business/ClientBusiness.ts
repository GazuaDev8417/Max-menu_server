import { Request } from "express"
import axios from "axios"
//import Client from "../model/Client"
import AdmUser from "../model/AdmUser"
import ClientData from "../data/ClientData"
import Authentication from "../services/Authentication"
import { GroupedProduct, UserModel } from "../model/InterfacesAndTypes"
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
        const { username, email, phone, senha, role } = req.body
        const id = v4()
        const token = new Authentication().token(id)
        const hash = new Authentication().hash(senha)
        const newUser = new AdmUser(
            id,
            username,
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
        const { email, senha } = req.body
        
        if(!email || !senha){
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

        const compare = new Authentication().compare(senha, user.password)        
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

        return user
    }

    clientById = async(req:Request):Promise<UserModel>=>{
        const user = await new Authentication().authToken(req)
        if(user.role !== 'ADM'){
            throw{
                statusCode: 403,
                error: new Error('Somente para usuário administrador')
            }
        }
        
        const client = await this.clientData.clientById(req.params.id)

        return client
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

    updateClientData = async(req:Request):Promise<void>=>{
        const user = await new Authentication().authToken(req)
        const { username, email, phone } = req.body

        if(!username || !email || !phone){
            throw{
                statusCode: 401,
                error: new Error('Preencha todos os campos')
            }
        }

        await this.clientData.updateClientData(
            username, email, phone, user.id
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

    /* clientsWithOrders = async():Promise<Order[]>=>{
        const groupedOrders = await this.clientData.clientsWithOrders()
        
        return groupedOrders
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

    removeClientOrder = async(id:string):Promise<void>=>{
        await this.clientData.removeClientOrder(id)
    }

    deleteAccount = async(req:Request):Promise<void>=>{
        const user = await new Authentication().authToken(req)
        
        await this.clientData.deleteAccount(user.id) 
    }

    productsOnOrderByClients = async(req:Request):Promise<GroupedProduct[]>=>{
        await new Authentication().authToken(req)
        const products = await this.clientData.productsOnOrderByClients()

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
}
