import { getPrismaClient } from '../prisma/prismaClient'
import { Hono } from 'hono'; import { homepage, status_404 } from '../utils/render_txt';
import { gnerateToken, hashPassword, usernameAvailability, userCredsValidation, authCreds } from './userMiddleware';

const app = new Hono<{
  Bindings :{
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.get('/', async (c) => {
  return c.render(homepage);
    
});

app.get('/getbulk',async(c) => {
  try{
    const prisma = await getPrismaClient(c);
    const posts = await prisma.post.findMany()
    return c.json({
      posts,success : true
    })
  }catch(e){
    console.log(e)
    return c.json({
      msg : "ERROR : can't get posts",success : false
    })
  }
})

app.post('/signup',userCredsValidation,usernameAvailability,async(c) => {
  try{
    const {username,password} = await c.req.json()
    const prisma = await getPrismaClient(c);
    const hashed_password = await hashPassword(password);

    const user = await prisma.user.create({
      data : {
        username : username,
        password : hashed_password,
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id,c.env.JWT_SECRET)
    return c.json({
      token : jwt_token,success : true
    })
  }catch(e){
    console.log(e)
    return c.json({
      msg : "ERROR : can't create user",success : false
    })
  }
})

app.post('/signin',userCredsValidation,authCreds,async(c) => {
  try{
    const {username} = await c.req.json()
    const prisma = await getPrismaClient(c);
    const user = await prisma.user.findUnique({
      where : {
        username
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id,c.env.JWT_SECRET)
    return c.json({
      token : jwt_token,success : true
    })
  }catch(e){
    console.log(e)
    return c.json({
      msg : "ERROR : can't create user",success : false
    })
  }
})


app.get('/*',async(c)=>{
  return c.render(status_404)
})






























export default app