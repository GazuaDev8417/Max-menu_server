import knex from "knex"
import { config } from "dotenv"


config()



export default abstract class Connexion{
    public static con = knex({
        client: 'pg',
        connection: process.env.maxmenu_neondb
    })

    public static testConnexion = async():Promise<void>=>{
        try{

            await this.con.raw('SELECT 1 + 1 AS RESULT')
            console.log('Conectado ao banco de dados')
            
        }catch(e){
            console.error(`Erro ao conectar ao bando de dados: ${e}`)
        }
    }
}

(async()=>{
    await Connexion.testConnexion()
})()