import { z } from "zod";

export const authUseOTPSchema = z.object({
    id: z.string({ message: 'ID do OTP obrigatório.'}),
    code: z.string({ message: 'OTP Obrigatório.' }).length(6, 'Código precisa conter 6 digitos.')
})