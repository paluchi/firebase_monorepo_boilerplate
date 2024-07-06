import { z } from "zod";
export declare const TodoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    completed: z.ZodBoolean;
    userId: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    text: string;
    completed: boolean;
    userId: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
}, {
    text: string;
    completed: boolean;
    userId: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
}>;
export type Todo = z.infer<typeof TodoSchema>;
