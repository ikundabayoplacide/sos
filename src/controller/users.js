import User from "../database/models/users.js";
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers=async(req,res)=>{
    try {
        const users=await User.findAll();
        res.status(200).json(users);
        console.log("All users",users)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Get single user
export const singleUser=async(req,res)=>{
    try {
        const user=await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//Create user
export const createUser=async(req,res)=>{
        try {
        const { password, ...userData } = req.body;
        const existing = await User.findOne({ where: { email: userData.email } });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ ...userData, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Update User
export const updateUser=async(req,res)=>{
    try {
        const user=await User.findByPk(req.params.id);
        if(!user)
        return res.status(404).json({message:"User not found, so we can not update user who is not in the system"});

        await user.update(req.body);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
}

// DELETE USER
export const deleteUser=async(req,res)=>{
    try {
        const delUser=await User.findByPk(req.params.id);
        if(!delUser)
            return res.status(404).json({ message: "User not found" });

        await delUser.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


