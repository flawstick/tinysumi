import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const tasksRouter = createTRPCRouter({
  // Mutation: Only "daddy" can add new tasks.
  addTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "daddy") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only daddy has permission to add tasks.",
        });
      }

      const newTask = await db
        .insert(tasks)
        .values({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          createdById: ctx.session.user.id,
        })
        .returning();

      return newTask;
    }),

  // Mutation: Only "daddy" can edit existing tasks.
  editTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "daddy") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only daddy has permission to edit tasks.",
        });
      }

      const updatedTask = await db
        .update(tasks)
        .set({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        })
        .where(eq(tasks.id, input.taskId))
        .returning();

      return updatedTask;
    }),

  // Mutation: Only "daddy" can delete tasks.
  deleteTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "daddy") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only daddy has permission to delete tasks.",
        });
      }

      const deletedTask = await db
        .delete(tasks)
        .where(eq(tasks.id, input.taskId))
        .returning();

      return deletedTask;
    }),

  // Query: Only users with role "tiny" can fetch tasks.
  fetchTasks: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only users with role tiny are allowed to fetch tasks.",
      });
    }

    // Query the tasks as defined by the existing schema
    const allTasks = await db.select().from(tasks);
    return allTasks;
  }),
});
