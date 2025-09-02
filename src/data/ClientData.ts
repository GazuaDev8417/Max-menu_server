import Connexion from "./Connexion"
//import Client from "../model/Client"
import { /* ClientModel, */ UserModel } from "../model/InterfacesAndTypes"
import { Order } from "../model/InterfacesAndTypes"
import AdmUser from "../model/AdmUser"



export default class ClientData extends Connexion{
    protected CLIENT_TABLE = 'clients'
    protected ADMUSER_TABLE = 'admuser'



    /* registClient = async(client:Client):Promise<void>=>{
        try{

            await client.save()

        }catch(e:any){
            throw new Error(e.message || e)
        }
    } */

    registUser = async(user:AdmUser):Promise<void>=>{
        try{

            await user.save()

        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    /* clientByPhone = async(phone:string):Promise<ClientModel>=>{
        try{

            const [client] = await Connexion.con(this.CLIENT_TABLE)
                .where({ phone })

            return client
        }catch(e:any){
            throw new Error(e.message || e)
        }
    } */

    userByPhone = async(phone:string):Promise<UserModel>=>{
        try{

            const [user] = await Connexion.con(this.ADMUSER_TABLE)
                .where({ phone })

            return user
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    userByEmail = async(email:string):Promise<UserModel>=>{
        try{

            const [user] = await Connexion.con(this.ADMUSER_TABLE)
                .where({ email })

            return user
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    userById = async(id:string):Promise<UserModel>=>{
        try{
            const [user] = await Connexion.con(this.ADMUSER_TABLE).where({ id })

            return user
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    userByPhoneAndEmail = async(phone:string, email:string):Promise<UserModel>=>{
        try{

            const [user] = await Connexion.con(this.ADMUSER_TABLE)
                .where({ phone, email })

            return user
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    updateAddress = async(
        street:string, cep:string, neighbourhood:string, complement:string, id:string
    ):Promise<void>=>{
        try{
            await Connexion.con(this.ADMUSER_TABLE).update({
                street,
                cep,
                neighbourhood,
                complement
            }).where({ id })
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    clientLastOrder = async():Promise<number>=>{
        try{

            const [result] = await Connexion.con(this.CLIENT_TABLE)   
                .max('pedido')
            const maxPedido = result.max
            
            return (Number(maxPedido) || 0) + 1 
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    clientsWithOrders = async():Promise<Order[]>=>{
        const clients = await Connexion.con(this.CLIENT_TABLE)

        if(clients.length === 0){
            throw new Error("Erro ao buscar pedidos de clientes")
        }

        return clients
    }

    removeClientOrder = async(id:string):Promise<void>=>{
        try{

            await Connexion.con(this.CLIENT_TABLE)
                .del()
                .where({ id })
                
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }
}


