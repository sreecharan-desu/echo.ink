import {
  getPrismaClient
} from '../prisma/prismaClient';
import {
  Hono
} from 'hono';
import {
  homepage,
  status_404,
  verified
} from '../utils/render_txt';
import {
  gnerateToken,
  hashPassword,
  usernameAvailability,
  userCredsValidation,
  authCreds,
  userAuth
} from './userMiddleware';
import { Prisma } from '@prisma/client';

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
    const {
      username,
      password
    } = await c.req.json()
    const prisma = await getPrismaClient(c);
    const hashed_password = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashed_password,
      },
      select: {
        _count: true,
        created_at: true,
        email: true,
        id: true,
        image_link: true,
        posts: {
          select: {
            id: true,
            created_at: true,
            description: true,
            is_edited: true,
            last_edited: true,
            title: true,
            User: {
              select: {
                email: true,
                id: true,
                username: true
              }
            },
            image_link: true,
            user_id: true,
          }
        },
        username: true
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id, c.env.JWT_SECRET)
    return c.json({
      token: jwt_token,
      user,
      success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't create user",
      success: false
    })
  }
})

app.post('/signin', userCredsValidation, authCreds, async (c) => {
  try {
    const {
      username
    } = await c.req.json()
    const prisma = await getPrismaClient(c);
    const user = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        _count: true,
        created_at: true,
        email: true,
        id: true,
        image_link: true,
        posts: {
          select: {
            id: true,
            created_at: true,
            description: true,
            is_edited: true,
            last_edited: true,
            title: true,
            User: {
              select: {
                email: true,
                id: true,
                username: true
              }
            },
            user_id: true,
            image_link: true,
          }
        },
        username: true
      }
    })
    //@ts-ignore
    const jwt_token = await gnerateToken(user.id, c.env.JWT_SECRET)
    return c.json({
      token: jwt_token,
      user,
      success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't able to signin",
      success: false
    })
  }
})

app.get('/getbulk', async (c) => {
  try {
    const prisma = await getPrismaClient(c);
    const posts = await prisma.post.findMany()
    return c.json({
      posts,
      posts_count: posts.length,
      success: true
    })
  } catch (e) {
    console.log(e)
    return c.json({
      msg: "ERROR : can't get posts",
      success: false
    })
  }
})

app.post('/createpost', userAuth, async (c) => {
  try {
    try {
      const {
        title,
        description,
        image_link
      } = await c.req.json();

      if (!title && !description) {
        return c.json({
          msg: "title & description required",
          success: false
        })
      } else if (!description) {
        return c.json({
          msg: "description required",
          success: false
        })
      } else if (!title) {
        return c.json({
          msg: "title required",
          success: false
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
          user_id: userId,
          image_link
        },
        select: {
          id: true,
          title: true,
          description: true,
          user_id: true,
          image_link: true,
          created_at: true,
          is_edited: true,
          last_edited: true,
          User: {
            select: {
              _count: true,
              created_at: true,
              email: true,
              id: true,
              image_link: true,
              username: true
            }
          }
        }
      })
      return c.json({
        msg: `post_${post.id} created successfully...`,
        success: true
      })
    } catch (e) {
      console.log(e)
      return c.json({
        msg: "FATAL : error creating post please try again!",
        success: false
      })
    }
  } catch (e) {
    return c.json({
      msg: `error creating post`,
      success: false
    })
  }
})

app.delete('/deletepost/:postId', userAuth, async (c) => {
  try {
    try {
      const postId = c.req.param('postId')
      console.log(postId)
      if (!postId) {
        return c.json({
          msg: "postId required",
          success: false
        })
      }

      //@ts-ignore
      const userId = c.get('userId');
      const prisma = await getPrismaClient(c);

      const Post = await prisma.post.findFirst({
        where: {
          id: postId
        }
      })

      if (!Post) {
        return c.json({
          msg: "FATAL : post not found",
          success: false
        })
      }

      const post = await prisma.post.delete({
        where: {
          id: postId,
          //@ts-ignore
          user_id: userId
        },
        select: {
          id: true,
          title: true,
          description: true,
          user_id: true,
          image_link: true,
          created_at: true,
          is_edited: true,
          last_edited: true,
          User: {
            select: {
              _count: true,
              created_at: true,
              email: true,
              id: true,
              image_link: true,
              username: true
            }
          }
        }
      })

      console.log(post)

      return c.json({
        msg: `post_${post.id} deleted successfully...`,
        success: true
      })
    } catch (e) {
      return c.json({
        msg: "Error : error deleting post",
        success: false
      })
    }


  } catch (e) {
    return c.json({
      msg: `error deleting post`,
      success: false
    })
  }
})

app.put('/updatepost/:postId', userAuth, async (c) => {
  try {
    try {
      const {
        title,
        description,
        image_link
      } = await c.req.json();
      const postId = c.req.param('postId')
      const prisma = await getPrismaClient(c);
      const Post = await prisma.post.findFirst({
        where: {
          id: postId
        }
      })

      console.log(Post)
      if (!Post) {
        return c.json({
          msg: "FATAL : post not found",
          success: false
        })
      }

      //@ts-ignore
      const userId = c.get('userId');
      console.log(userId)
      const post = await prisma.post.update({
        where: {
          //@ts-ignore
          user_id: userId,
          id: postId
        },
        data: {
          title,
          description,
          //@ts-ignore
          user_id: userId,
          image_link,
          is_edited : true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          user_id: true,
          User: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      })
      return c.json({
        msg: `post_${post.id} created successfully...`,
        success: true
      })
    } catch (e) {
      console.log(e)
      return c.json({
        msg: "FATAL : postId not found",
        success: false
      })
    }


  } catch (e) {
    return c.json({
      msg: `error creating post`,
      success: false
    })
  }
})

app.put('/updateprofile', userAuth, async (c) => {
  try {
    try {
      const {
        username,
        email,
        image_link
      } = await c.req.json();
      //@ts-ignore
      const userId = c.get('userId');
      const prisma = await getPrismaClient(c);
      const User = await prisma.user.findFirst({
        where: {
          //@ts-ignore
          id: userId
        }
      })

      if (!User) {
        return c.json({
          msg: "FATAL : post not found",
          success: false
        })
      }

      const user = await prisma.user.update({
        where: {
          //@ts-ignore
          id: userId,
          username
        },
        data: {
          //@ts-ignore
          id: userId,
          username,
          email,
          image_link,
        },
        select: {
          id: true,
          posts: {
            select: {
              id: true,
              created_at: true,
              description: true,
              image_link: true,
              is_edited: true,
              last_edited: true,
              title: true,
              User: {
                select: {
                  _count: true,
                  created_at: true,
                  email: true,
                  id: true,
                  image_link: true,
                  username: true
                }
              }
            }
          }
        }
      })
      return c.json({
        msg: `post_${user.id} updated successfully...`,
        success: true
      })
    } catch (e) {
      return c.json({
        msg: "Error : updating user profile",
        success: false
      })
    }


  } catch (e) {
    return c.json({
      msg: `error creating post`,
      success: false
    })
  }
})

app.get('/post/:postId', async (c) => {
  const postId = await c.req.param('postId');
  const prisma = await getPrismaClient(c);

  const post = await prisma.post.findFirst({
    where: {
      id: postId
    }
  })

  if (!post) {
    return c.json({
      msg: "The post you are trying to access doesn't exist!", success: false
    })
  }

  return c.json({
    post, success: true
  })

})

app.get('/author/:userId', async (c) => {
  const userId = await c.req.param('userId');
  const prisma = await getPrismaClient(c);
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      _count: true,
      created_at: true,
      email: true,
      id: true,
      image_link: true,
      posts: {
        select: {
          created_at: true,
          description: true,
          id: true,
          image_link: true,
          is_edited: true,
          last_edited: true,
          title: true,
          user_id: true
        }
      }
    }
  })

  return c.json({
    user, success: true
  })

})

app.get('/*', async (c) => {
  return c.render(status_404)
})

app.post('/*', async (c) => {
  return c.render(status_404)
})

export default app