import { RequestHandler } from "express";
import { authSignInSchema } from "../schemas/auth-signin";
import { createUser, getUserByEmail } from "../services/user";
import { generateOTP } from "../services/otp";
import { sendEmail } from "../libs/mailtrap";
import { authSignUpSchema } from "../schemas/auth-signup";

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