import jwt from 'jsonwebtoken'

export const createJWT = (id: number) => {
    return jwt.sign({
        id
    }, 
    process.env.JWT_SECRET as string
    )
}