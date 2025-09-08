import Connexion from "./Connexion"
//import Client from "../model/Client"
import { /* ClientModel, */ FlavorModel, GroupedProduct, ProductCartModel, UserModel } from "../model/InterfacesAndTypes"
//import { Order } from "../model/InterfacesAndTypes"
import AdmUser from "../model/AdmUser"



export default class ClientData extends Connexion{
    protected CLIENT_TABLE = 'clients'
    protected ADMUSER_TABLE = 'admuser'
    protected CART = 'cart'
    protected PRODUCTS_CART = 'products_cart'



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

    clientById = async(id:string):Promise<UserModel>=>{
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

    updateClientData = async(
        user:string, email:string, phone:string, id:string
    ):Promise<void>=>{
        try{
            await Connexion.con(this.ADMUSER_TABLE).update({
                user,
                email,
                phone
            }).where({ id })
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    /* clientLastOrder = async():Promise<number>=>{
        try{

            const [result] = await Connexion.con(this.CLIENT_TABLE)   
                .max('pedido')
            const maxPedido = result.max
            
            return (Number(maxPedido) || 0) + 1 
        }catch(e:any){
            throw new Error(e.message || e)
        }
    } */

    /* clientsWithOrders = async():Promise<Order[]>=>{
        const clients = await Connexion.con(this.CLIENT_TABLE)

        if(clients.length === 0){
            throw new Error("Erro ao buscar pedidos de clientes")
        }

        return clients
    } */

    /* removeClientOrder = async(id:string):Promise<void>=>{
        try{

            await Connexion.con(this.CLIENT_TABLE)
                .del()
                .where({ id })
                
        }catch(e:any){
            throw new Error(e.message || e)
        }
    } */

    deleteAccount = async(id:string):Promise<void>=>{
        try{
            await Connexion.con(this.CART).del().where({ client: id })
            await Connexion.con(this.PRODUCTS_CART).del().where({ client: id })
            await Connexion.con(this.ADMUSER_TABLE).del().where({ id })
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }

    productsOnOrderByClients = async():Promise<GroupedProduct[]>=>{
        try{

            const flavors:FlavorModel[] = await Connexion.con(this.CART)                
            const products:ProductCartModel[] = await Connexion.con(this.PRODUCTS_CART)
                
            const groupedByProduct: Record<string, FlavorModel[]> = flavors.reduce(
                (acc, item)=>{
                    if(!acc[item.product_id]){
                        acc[item.product_id] = []
                    }
                    acc[item.product_id].push(item)
                    return acc
                },
                {} as Record<string, FlavorModel[]>
            )  

            const groupedWithProductInfo:GroupedProduct[] = products.map(product=>{
                if(product.category === 'bebida'){
                    return{
                        product,
                        items:[]
                    }
                }
                return{
                    product,
                    items: (groupedByProduct[product.product_id] || []).sort((a, b) => a.flavor.localeCompare(b.flavor))
                }                
            }).sort((a, b) => a.product.product.localeCompare(b.product.product))
            
            return groupedWithProductInfo
        }catch(e:any){
            throw new Error(e.message || e)
        }
    }
}


