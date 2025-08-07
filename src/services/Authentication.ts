import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'




type TokenData = {
    userId:string
    iat:number
    exp:number
}

export default class Authentication{
    token = (userId:string):string=>{
        return jwt.sign(
            { userId },
            process.env.JWT_KEY as string
        )
    }

    tokenData = (token:string):TokenData=>{
        return jwt.verify(
            token,
            process.env.JWT_KEY as string
        ) as TokenData
    }

    hash = (txt:string):string=>{
        const rounds = 12
        const salt = bcrypt.genSaltSync(rounds)
        const cypher = bcrypt.hashSync(txt, salt)

        return cypher
    }

    compare = (txt:string, hash:string):boolean=>{
        return bcrypt.compareSync(txt, hash)
    }

    /* authToken = async(req:Request):Promise<ClientModel>=>{
        const token = req.headers.authorization
        
        const tokenData =  this.tokenData(token as string)
        const user = await new ClientData().clientById(tokenData.payload)
        
        if(!user){
            throw{
                statusCode: 404,
                error: new Error('Usuário não encontrado')
            }
        }    
        return user
    } */
}