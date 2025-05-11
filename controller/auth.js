import  Auth  from '../model/auth.js'
import generateToken from '../model/auth.js'


export const Register = async(req,res)=>{

    try {
        const {username,email,password} = req.body
        if(!username || !email || !password) {
            console.log('all field are require')
            return res.status(400).json({message:'all field are require'})
        }

        // if password is less than 6 character long
        if(password.length < 6){
            return res.status(400).json({message:"Password should be more than 6 character long"})
        }

        // if username is less than 3 character long
        if(username.length < 3){
            return res.status(400).json({message:"Username should be more than 3 character long"})
        }

        // check if email already exist
        const existEmail = await Auth.findOne({email})
        if(existEmail ){
            return res.status(400).json({message:"email already exist with this "})
        }


        // check existing username
        const existUsername = await Auth.findOne({username})
        if(existUsername){
            return res.status(400).json({message:"username is not available "})
        }

        //generate profieImage avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        // create user
        const user = new Auth({
            email,
            password,
            username,
            profileImage
        })
        await user.save()


        //generate token
        const token = generateToken(user._id)


        res.status(201).json({
            sucess:true,
            message:"account created successfully",
            token,
            user:{
                _id:user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        res.status(500).json({message:'internal error'})
    }
}


export const Login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password) return res.status(400).json({message:'all field are require'})

        //check if user exist
        const user = await Auth.findOne({email});
        if(!user) return res.status(400).json({message:"invalid credentials"})

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(400).json({message:"invalid credentials"})

        const token = generateToken(user._id)
        res.status(201).json({
            sucess:true,
            message:"account logged in successfully",
            token,
            user:{
                _id:user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })

        
    } catch (error) {
        res.status(500).json({message:'internal error'})
    }
}


