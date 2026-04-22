import User from "../models/users.js";
import bcrypt from 'bcrypt'

export const seedUsers=async()=>{
    const hashPassword=await bcrypt.hash('defaultPassword123',10)
    const users=[
          {
            fullName:'SHEMA',
            email:'shema@gmail.com',
            phoneNumber:'038373737373',
            gender:'male',
            role:'patient',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:'02933838383',
            password:hashPassword
          },
          {
            fullName:'ILONA',
            email:'ilona@gmail.com',
            phoneNumber:'038345678677373',
            gender:'female',
            role:'patient',
            status:'active',
            date_of_birth:'12-02-2006',
            location:'kigali',
            emergency_contact:'02936638383',
            password:hashPassword
          },
          {
            fullName:'Dr. MUGISHA',
            email:'mugisha@gmail.com',
            phoneNumber:'0788888888',
            gender:'male',
            role:'doctor',
            status:'active',
            date_of_birth:'15-05-1985',
            location:'kigali',
            emergency_contact:'0799999999',
            password:hashPassword
          },
          {
            fullName:"Administrator",
            email:"admin@gmail.com",
            phoneNumber:'0788888888',
            gender:'male',
            role:'admin',
            status:'active',
            date_of_birth:'15-05-1985',
            location:'kigali',
            emergency_contact:'0799999999',
            password:hashPassword
          }
    ]
    
    await User.bulkCreate(users, { ignoreDuplicates: true });
}