import Connexion from "../data/Connexion"



export default class AdmUser extends Connexion{
    protected USER_TABLE = 'admuser'

    constructor(
        private id:string,
        private user:string,
        private email:string,
        private phone:string,
        private password:string,
        private role:string
    ){ super() }

    save = async()=>{
        try{
            await Connexion.con(this.USER_TABLE).insert({
                id: this.id.trim(),
                user: this.user.trim(),
                email: this.email.trim(),
                phone: this.phone.trim(),
                password: this.password.trim(),
                role: this.role.trim()
            })
        }catch(e){
            throw new Error(`Erro ao registrar usuário: ${e}`)
        }
    }
}