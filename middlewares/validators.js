const { z } = require('zod');

exports.userSignupSchema = z.object({
    password: z
        .string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .max(100, { message: 'La contraseña es demasiado larga' })
        .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minúscula' })
        .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula' })
        .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
        .regex(/[^a-zA-Z0-9]/, { message: 'La contraseña debe contener al menos un carácter especial' }),
    confirmPassword: z
        .string()
        .refine(data => data.password === data.confirmPassword, {
            message: 'Las contraseñas no coinciden',
            path: ['confirmPassword'],
        })
});

exports.userLoginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'El correo y la contraseña son requeridos.' })
        .email({ message: 'Email inválido' })
        .transform(email => email.toLowerCase().trim()),

    password: z
        .string()
        .min(1, { message: 'El correo y la contraseña son requeridos.' }),
});

exports.validate = schema => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error.issues);
        return res.status(400).json({
            ok: false,
            code: "VALIDATION_ERROR",
            message: "Error de validación",
            errors: error.issues.map(err => ({
                field: err.path[0],
                message: err.message,
            }))
        })
    }
}