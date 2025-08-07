import Connexion from "../data/Connexion"
import { v4 } from "uuid"



const flavors =  [
                    { flavor: 'CAMARÃO', price: '+ R$ 6,00', max_quantity: 10 }
                ]

const insertFlavors = async()=>{
    const step = 3
    /* =========================ATENÇÃO============================================== */
    const product_id = '86b3f68a-250e-48de-a1f3-f1dfb31cf4c5' /* ATENÇÃO MÁXIMA AQUI */
    /* =========================MUITA ATENÇÃO========================================== */
    const subtitle = 'Escolha os Sabores'
    try{
        const data = flavors.map(f =>   ({
            id: v4(),
            flavor: f.flavor,
            price: f.price.replace(/\D/g, ''),
            /* ingredients: f.ingredients, */
            max_quantity: f.max_quantity,
            total: 0,
            step,
            quantity: 0,
            subtitle,
            product_id
        }))
        await Connexion.con('flavors').insert(data)
        console.log(`${data.length} sabores inseridos com sucesso`)
    }catch(e){
        console.log(`Erro ao inserir sabores: ${e}`)
    }finally{
        await Connexion.con.destroy()
        console.log('Conexão encerrada')
    }
}



insertFlavors()

