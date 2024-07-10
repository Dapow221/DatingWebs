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
      title: z.string().min(3).max(80),
      description: z.string().min(3).max(280),
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

  getUserPosts: publicProcedure.input(
    z.string().cuid()
  ).query(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const posts = db.post.findMany({
      where: {
        createdById: input
      },
      include: {
        images: true,
      }
    })

    return posts;
  })
});
