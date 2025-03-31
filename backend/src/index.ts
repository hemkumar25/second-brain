import  express , { Request, Response } from "express";
import mongoose from "mongoose";
import z from 'zod'
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import { contentModel, linkModel, UserModel } from "./db"
import config from "./config";
import { userMiddlerware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json())



const signupSchema = z.object({
    username: z.string().min(3,"username must be at 3 characters").max(10, "username must be at most 10 characters").regex(/^[a-zA-Z]+$/,"username should contain only letters"),
    password: z.string()
        .min(8,"password must be at least 8 characters")
        .max(20,"password must be at most 20 characters")
        .regex(/[A-Z]/,"password must contain at least one uppercase letter")
        .regex(/[a-z]/, "password must contain at least one lowercase letter")
        .regex(/\d/,"password must contain at least one number")
        .regex(/[@#$%*?&]/, "password must contain at one special character (@#$%?*&)"),
    email : z.string().email()
});

const signinSchema = z.object({
    username: z.string().min(3,"username must be at 3 characters").max(10, "username must be at most 10 characters").regex(/^[a-zA-Z]+$/,"username should contain only letters"),
    password: z.string()
        .min(8,"password must be at least 8 characters")
        .max(20,"password must be at most 20 characters")
        .regex(/[A-Z]/,"password must contain at least one uppercase letter")
        .regex(/[a-z]/, "password must contain at least one lowercase letter")
        .regex(/\d/,"password must contain at least one number")
        .regex(/[@#$%*?&]/, "password must contain at one special character (@#$%?*&)"),
});



app.post("/api/v1/signup", async (req: Request, res:Response ) =>{
    //zod input validation 
    const parseData = signupSchema.safeParse(req.body)
    if(!parseData.success){
      res.status(411).json({ message: parseData.error.errors.map(err => err.message) })
    }
    
    //@ts-ignore
   const { username, password, email }  = parseData.data

   try{
    const existingUser =  await UserModel.findOne({username})
    if (existingUser){
        res.status(403).json({message:"user already exist"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
        username,
        email,
        password:hashedPassword
    })

    res.status(200).json({
        message: "you signed up successfully"
    })
   }catch(e){
        console.error("Signup Error:", e);
        res.status(500).json({ message: "Server error" });
    }
})

//@ts-ignore
app.post("/api/v1/signin",async (req:Request, res: Response)=>{
    const parseData = signinSchema.safeParse(req.body);
    if (!parseData.success){
        res.status(411).json({message:parseData.error.errors.map(error=>error.message)})
    }

    //@ts-ignore
    const { username, password } = parseData.data

    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return res.status(403).json({message:"invalid username or password"});
        }
        //@ts-ignore
        const isValidPassword = await bcrypt.compare(password,user.password)
        if (!isValidPassword){
            res.status(403).json({message:"invalid username or password"})
        }

        console.log(user)

        
        const token =jwt.sign({
            id:user._id.toString()
        },config.JWT_SECRET as string);

        res.status(200).json({
            message:"you signed up successfully",
            token
        })

    }catch(e){
        console.error("Signin Error:", e);
        res.status(500).json({ message: "Server error" });
    }
})

app.post("/api/v1/content",userMiddlerware, async (req, res)=>{
    const { link, type, title } = req.body;

    await contentModel.create({
        type,
        title,
        link,
        //@ts-ignore
        userId : req.userId,
        tags: []
    })

    res.json({
        message: "Content Added"
    })
})

app.get("/api/v1/content", userMiddlerware, async (req, res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await contentModel.find({
        userId ,
    }).populate("userId", "username")

    res.json({
        content
    })

})

app.delete("/api/v1/content", userMiddlerware, async (req, res)=>{
    const { contentId }= req.body;

    await contentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId : req.userId
    })

    res.json({
        message:"deleted"
    })
})

app.post("/api/v1/brain/share",async (req, res) =>{
    const { share } = req.body;

    if(share){

        const existingLink = await linkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }

        const hash = random(10)
        await linkModel.create({
            //@ts-ignore
            userId:req.userId,
            hash: hash
        })

        res.json({
            message: "/share/" + hash
        })
    }else{
        await linkModel.deleteOne({
            //@ts-ignore
            userId:req.userId
        })
        res.json({
            message:"removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res)=>{
    const hash =req.params.shareLink;

    const link = await linkModel.findOne({
        hash
    });

    if(!link){
        res.status(411).json({
            message: "sorry link not found"
        })
        return;
    }

    const content = await contentModel.find({
        //@ts-ignore
        userId:link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if(!user){
        res.status(411).json({
            message:"user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username:user.username,
        content:content

    })


})


async function main() {
    try {

        //when i try to use mongo url direct it works but when i try to use the config then it crashes
        await mongoose.connect(config.MONGO_URL as string);
        app.listen(config.PORT, () => {
          console.log(`Server is running on port ${config.PORT}`);
        });
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
      }
}

main()