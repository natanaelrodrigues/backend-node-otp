import { RequestHandler } from "express";
import { authSignInSchema } from "../schemas/auth-signin";
import { createUser, getUserByEmail } from "../services/user";
import { generateOTP, validateOTP } from "../services/otp";
import { sendEmail } from "../libs/mailtrap";
import { authSignUpSchema } from "../schemas/auth-signup";
import { authUseOTPSchema } from "../schemas/auth-useotp";
import { createJWT } from "../libs/jwt";

export const signin: RequestHandler = async (req, res) => {
    // Valida os dados recebidos.
    const data = authSignInSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            error: data.error.flatten().fieldErrors
        })
        return;
    }

    // verificar se o usuário existe
    const user = await getUserByEmail(data.data.email);
    if(!user){
        res.json({
            error: 'Usuário não existe.'
        })
        return;
    }

    // Gerar um código OTP para o usuário
    const otp = await generateOTP(user.id); 

    // Enviar um e-mail para o usuário
    await sendEmail(
        user.email,
        `Seu código de acesso é: ${otp.code}.`,
        `Digite seu código de acesso: ${otp.code}.`
    );


    // Devolve o ID do código OTP
    res.json({
        id: otp.id
    });

}

export const signup: RequestHandler = async (req, res) => {
    // Valida Dados Recebidos
    const data = authSignUpSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            error: data.error.flatten().fieldErrors
        })
        return;
    }

    // Verifica se o e-mail já existe
    const user = await getUserByEmail(data.data.email);
    if(user){
        res.json({
            error: 'Já existe usuário cadastrado para este e-mail.'
        })
        return;
    }

    // Cria o usuário
    const newUser = await createUser(data.data.name, data.data.email);

    // Retorna os dados do usuário criado.
    res.status(201).json({user: newUser})
}

export const useOTP: RequestHandler = async (req, res) => {
    // Validar os dados recebidos
    const data = authUseOTPSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            error: data.error.flatten().fieldErrors
        })
        return;
    }

    // Validar o OTP
    const user = await validateOTP( data.data.id, data.data.code )

    if(!user) {
        res.json({ error: 'OTP inválido ou expirado.'})
        return
    }

    // Cria o JWT
    const token = createJWT(user.id)


    // Retorna o JWT
    res.json({ token, user })
}

