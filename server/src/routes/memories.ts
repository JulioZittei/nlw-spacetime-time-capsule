import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const userId = 'b4b42e09-a628-4b87-a6dd-94bb2fd13685'

    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        userId,
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 112).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/memories', async (req, res) => {
    const userId = 'b4b42e09-a628-4b87-a6dd-94bb2fd13685'

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(req.body)

    const memory = await prisma.memory.create({
      data: {
        coverUrl,
        isPublic,
        content,
        userId,
      },
    })

    res.statusCode = 201
    return memory
  })

  app.put('/memories/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(req.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        coverUrl,
        isPublic,
        content,
      },
    })

    res.statusCode = 201
    return memory
  })

  app.delete('/memories/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    res.statusCode = 204
    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
