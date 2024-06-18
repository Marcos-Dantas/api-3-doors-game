import {body} from "express-validator";

export const getValidators = (prisma) => ({ 
    createUserValidator:  [
        body('email', 'Email não pode ser vazio').not().isEmpty(),
        body('name', 'Nome não pode ser vazio').not().isEmpty(),
        body('city', 'Cidade não pode ser vazio').not().isEmpty(),
        body('state', 'Estado não pode ser vazio').not().isEmpty(),
        body('age', 'Idade não pode ser vazio').not().isEmpty(),
        body('email', 'Email invalido').isEmail(),
        body('email').custom(async (email) => {
            const user = await prisma.user.findUnique({
            where: {email: email}
            })
            if (user) {
            throw new Error('Email ja esta em uso')
            } 
        }),
        body('password', 'password não pode ser vazio').not().isEmpty(),
        body('password', 'O comprimento mínimo da senha é de 6 caracteres').isLength({min: 6}),
    ],
    loginValidator: [
        body('email', 'Email não pode ser vazio').not().isEmpty(),
        body('email', 'Email invalido').isEmail(),
        body('password', 'password não pode ser vazio').not().isEmpty(),
        body('password', 'O comprimento mínimo da senha é de 6 caracteres').isLength({min: 6}),
    ]
});

export default getValidators;