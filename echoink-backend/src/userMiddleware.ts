import { Context, Next } from "hono";import bcrypt from "bcryptjs";
import z from "zod"
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { getPrismaClient } from "../prisma/prismaClient";

export const hashPassword = async(password:string)=>{
    return await bcrypt.hash(password,4);
}

export const gnerateToken = async(payload:JWTPayload,secret:string)=>{
    const token = await sign(payload,secret)
    return token;
}


export const userCredsValidation = async(c:Context,next:Next)=>{
    const {username,password} = await c.req.json();
    const validation = z.object({
        username : z.string().min(4,{message : "username should contain minimum 4 chars"}).max(10,{message : "username should maximum contain 10 chars"}),
        password : z.string().min(6,{message : "your password should contain atleast 6 chars"}).max(16,{message : "password should maximum contain 16 chars"})
    })


    const validate = validation.safeParse({username,password})
    if(validate.success){
        await next()
    }else{
        return c.json({
            errors : validate.error.issues.map(e=>`(${e.code}) ${e.code == "invalid_type" ? e.path[0] : '' + e.message}`.toLowerCase()),success : false
        })
    }


}


export const usernameAvailability = async(c:Context,next:Next)=>{
    const {username} = await c.req.json();
    const prisma  = await getPrismaClient(c);


    const user = await prisma.user.findUnique({
        where : {
            username
        }
    })
    if(user){
        return c.json({
            msg : `${username} is not available please try another`,succes : false
        })
    }else{
        await next()
    }
}

export const authCreds = async(c:Context,next:Next)=>{
    const {username,password} = await c.req.json()
    const prisma  = await getPrismaClient(c);
    const user = await prisma.user.findUnique({
        where : {
            username
        }
    })
    if(user){
        const verified = await bcrypt.compare(password,user.password)
        if(verified){
            await next()
        }else{
            return c.json({
                msg : "Error : INVALID_CREDS, please try again!",success : false
            })
        }
    }else{
        return c.json({
            msg : "FATAL : user not found",success : false
        })
    }
}


export const userAuth = async(c: Context, next: Next) => {
  try {
    const authorization = await c.req.header('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return c.json({
        msg: "No token provided",
        success: false
      });
    }

    const token = authorization.split(" ")[1];
    
    if (!token) {
      return c.json({
        msg: "Invalid token format",
        success: false
      });
    }

    try {
      //@ts-ignore
      const decoded = await verify(token, c.env.JWT_SECRET);
      c.set('userId', decoded);
      await next();
    } catch (error) {
      console.error('Token verification error:', error);
      return c.json({
        msg: "Invalid token",
        success: false
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({
      msg: "Authentication failed",
      success: false
    });
  }
};

// Create a separate middleware for checking username ownership
export const checkUserOwnership = async(c: Context, next: Next) => {
  try {
    const { username } = await c.req.json();
    const prisma = await getPrismaClient(c);
    //@ts-ignore
    const user = await prisma.user.findUnique({ where: { id: c.get('userId') } });
    
    if (!user || user.username !== username) {
      return c.json({
        msg: "AUTH FAILED: This is not your account!",
        success: false
      });
    }
    
    await next();
  } catch (error) {
    console.error('User ownership check error:', error);
    return c.json({
      msg: "Error verifying user ownership",
      success: false
    });
  }
};