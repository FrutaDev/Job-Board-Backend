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

exports.jobSchema = z.object({
    title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres.' })
        .max(100, { message: 'El título debe tener menos de 100 caracteres.' })
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ ]+$/, { message: 'El título debe contener solo letras, números y espacios.' })
        .transform(title => title.trim()),
    description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
        .max(200, { message: 'La descripción debe tener menos de 200 caracteres.' })
        .transform(description => description.trim()),
    responsibilities: z.string().min(10, { message: 'Las responsabilidades deben tener al menos 10 caracteres.' })
        .max(200, { message: 'Las responsabilidades deben tener menos de 200 caracteres.' })
        .transform(responsibilities => responsibilities.trim()),
    requirements: z.string().min(10, { message: 'Los requisitos deben tener al menos 10 caracteres.' })
        .max(200, { message: 'Los requisitos deben tener menos de 200 caracteres.' })
        .transform(requirements => requirements.trim()),
    benefits: z.string().min(10, { message: 'Los beneficios deben tener al menos 10 caracteres.' })
        .max(200, { message: 'Los beneficios deben tener menos de 200 caracteres.' })
        .transform(benefits => benefits.trim()),
    salary_min: z.number().min(1, { message: 'El salario es requerido.' })
        .transform(salary_min => salary_min.trim()),
    salary_max: z.number().min(1, { message: 'El salario es requerido.' })
        .transform(salary_max => salary_max.trim()),
    typeOfJobId: z.number().min(1, { message: 'El tipo de trabajo es requerido.' }),
    modalityId: z.number().min(1, { message: 'La modalidad es requerida.' }),
    companyId: z.number().min(1, { message: 'La empresa es requerida.' }),
});

exports.companySchema = z.object({
    name: z.string().min(4, { message: 'El nombre debe tener al menos 4 caracteres.' })
        .max(100, { message: 'El nombre debe tener menos de 100 caracteres.' })
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ. ]+$/, { message: 'El nombre debe contener solo letras, números, puntos y espacios.' })
        .transform(name => name.trim()),
    rfc: z.string().min(12, { message: 'El RFC debe tener al menos 12 caracteres.' })
        .max(13, { message: 'El RFC debe tener menos de 13 caracteres.' })
        .regex(/^[a-zA-Z0-9]+$/, { message: 'El RFC debe contener solo letras, números.' })
        .transform(rfc => rfc.toUpperCase().trim()),
    country: z.string().min(1, { message: 'El país es requerido.' }),
    state: z.string().min(1, { message: 'El estado es requerido.' }),
    city: z.string().min(1, { message: 'La ciudad es requerida.' }),
    zipCode: z.string().min(1, { message: 'El código postal es requerido.' })
        .max(10, { message: 'El código postal debe tener menos de 10 caracteres.' })
        .regex(/^[0-9]+$/, { message: 'El código postal debe contener solo números.' })
        .transform(zipCode => zipCode.trim()),
    street: z.string().min(1, { message: 'La calle es requerida.' })
        .max(100, { message: 'La calle debe tener menos de 100 caracteres.' })
        .regex(/^[a-zA-Z0-9 ]+$/, { message: 'La calle debe contener solo letras, números y espacios.' })
        .transform(street => street.trim()),
    streetNumber: z.string().min(1, { message: 'El número de la calle es requerido.' })
        .regex(/^[0-9]+$/, { message: 'Solo debe contener números.' })
        .transform(streetNumber => streetNumber.trim()),
    email: z.string().min(1, { message: 'El correo es requerido.' })
        .email({ message: 'El correo es inválido.' })
        .transform(email => email.toLowerCase().trim()),
    phone: z.string().min(10, { message: 'Longitud inválida.' })
        .max(11, { message: 'Longitud inválida.' })
        .regex(/^[0-9]+$/, { message: 'El teléfono debe contener solo números.' })
        .transform(phone => phone.trim()),
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