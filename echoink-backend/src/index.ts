import { getPrismaClient } from '../prisma/prismaClient'
import { Hono } from 'hono'; import { homepage, status_404 } from '../utils/render_txt';
import { gnerateToken, hashPassword, usernameAvailability, userCredsValidation, authCreds, userAuth } from './userMiddleware';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.get('/', async (c) => {
  return c.render(homepage);

});

app.post('/signup', userCredsValidation, usernameAvailability, async (c) => {
  try {
    const { username, password } = await c.req.json()
    const prisma = await getPrismaClient(c);
    const hashed_password = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashed_password,
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id, c.env.JWT_SECRET)
    return c.json({
      token: jwt_token, success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't create user", success: false
    })
  }
})

app.post('/signin', userCredsValidation, authCreds, async (c) => {
  try {
    const { username } = await c.req.json()
    const prisma = await getPrismaClient(c);
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id, c.env.JWT_SECRET)
    return c.json({
      token: jwt_token, success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't able to signin", success: false
    })
  }
})

app.get('/getbulk', async (c) => {
  try {
    const prisma = await getPrismaClient(c);
    const posts = await prisma.post.findMany()
    return c.json({
      posts, success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't get posts", success: false
    })
  }
})

app.post('/createpost', userAuth, async (c) => {
  try {
    try {
      const { title, description } = await c.req.json();

      if (!title && !description) {
        return c.json({
          msg: "title & description required", success: false
        })
      } else if (!description) {
        return c.json({
          msg: "description required", success: false
        })
      } else if (!title) {
        return c.json({
          msg: "title required", success: false
        })
      }

      //@ts-ignore
      const userId = c.get('userId');
      const prisma = await getPrismaClient(c);

      const post = await prisma.post.create({
        data: {
          title,
          description,
          //@ts-ignore
          user_id: userId
        }, select: {
          id: true,
          title: true,
          description: true,
          user_id: true,
          User: true
        }
      })

      console.log(post)

      return c.json({
        msg: `post_${post.id} created successfully...`, success: true
      })
    } catch (e) {
      return c.json({
        msg: "FATAL : title and description not found", success: false
      })
    }


  } catch (e) {
    return c.json({
      msg: `error creating post`, success: false
    })
  }
})

app.delete('/deletepost', userAuth, async (c) => {
  try {
    try {
      const postId = await c.req.param('postId')

      if (!postId) {
        return c.json({
          msg: "title & description required", success: false
        })
      }

      //@ts-ignore
      const userId = c.get('userId');
      const prisma = await getPrismaClient(c);

      const post = await prisma.post.delete({
        where: {
          id: postId,
          //@ts-ignore
          user_id: userId
        }
      })

      console.log(post)

      return c.json({
        msg: `post_${post.id} deleted successfully...`, success: true
      })
    } catch (e) {
      return c.json({
        msg: "FATAL : title and description not found", success: false
      })
    }


  } catch (e) {
    return c.json({
      msg: `error deleting post`, success: false
    })
  }
})

app.get('/*', async (c) => {
  return c.render(status_404)
})

app.post('/*', async (c) => {
  return c.render(status_404)
})

export default app