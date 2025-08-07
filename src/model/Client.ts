import Connexion from "../data/Connexion"



export default class Client extends Connexion{
    protected CLIENT_TABLE = 'clients'
    
    constructor(
        private id:string,			
        private pedido:string
    ){ super() }


    save = async()=>{
        try{
            await Connexion.con(this.CLIENT_TABLE).insert({
                id: this.id,
                pedido: this.pedido.trim()
            })
        }catch(e){
            throw new Error(`Erro ao registrar cliente: ${e}`)
        }
    }
}