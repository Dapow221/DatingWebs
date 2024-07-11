import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure.input(
    z.object({
      title: z.string().min(3).max(380),
      description: z.string().min(3).max(1000),
      createdById: z.string().cuid(),
      images: z.array(z.string().url()).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx

    const newPost = await db.post.create({
      data: {
        title: input.title,
        description: input.description,
        couplesId: session.user.id,
        createdById: input.createdById,
      }
    });

    if (input.images && input.images.length > 0) {
      await db.image.createMany({
        data: input.images.map((imageUrl) => ({
          url: imageUrl,
          postId: newPost.id,
        })),
      });
    }
  }),

  getUserPosts: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const posts = await db.post.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return posts;
  }),

  deletePosts: publicProcedure.input(
    z.number()
  ).mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    await db.post.delete({
      where: {
        id: input as unknown as number
      } 
    })
  })
});
