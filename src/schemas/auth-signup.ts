import { z } from "zod";

export const authSignUpSchema = z.object({
    name: z.string({ message: 'Campo name é obrigatório'}),
    email: z.string({ message: 'Campo email é obrigatório'}).email('E-mail inválido')
})