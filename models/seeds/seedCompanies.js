const Company = require("../companyModel");

exports.seedCompanies = async () => {
    try {
        const count = await Company.count();

        if (count <= 2) {
            await Company.bulkCreate([
                {
                    name: "TechNova Solutions",
                    rfc: "TNS230401A12",
                    logo: "/uploads/logos/technova.png",
                    country: "Mexico",
                    state: "Chihuahua",
                    city: "Chihuahua",
                    zip_code: "31000",
                    street: "Av. Tecnológico",
                    street_number: "4501",
                    contact_email: "contact@technova.mx",
                    contact_phone: "6141234567",
                    isApproved: "approved",
                    description: "Software development company specialized in enterprise web systems.",
                    isActive: true,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    name: "AgroTech del Norte",
                    rfc: "ATN210512B88",
                    logo: "/uploads/logos/agrotech.png",
                    country: "Mexico",
                    state: "Chihuahua",
                    city: "Delicias",
                    zip_code: "33000",
                    street: "Calle Agricultura",
                    street_number: "120",
                    contact_email: "info@agrotech.mx",
                    contact_phone: "6391029384",
                    isApproved: "approved",
                    description: "Agricultural technology company focused on smart irrigation and crop monitoring.",
                    isActive: true,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    name: "DataForge Analytics",
                    rfc: "DFA220315C44",
                    logo: "/uploads/logos/dataforge.png",
                    country: "Mexico",
                    state: "Nuevo León",
                    city: "Monterrey",
                    zip_code: "64000",
                    street: "Av. Constitución",
                    street_number: "1800",
                    contact_email: "careers@dataforge.mx",
                    contact_phone: "8182345566",
                    isApproved: "pending",
                    description: "Data analytics and business intelligence solutions for modern enterprises.",
                    isActive: true,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    name: "CloudAxis Technologies",
                    rfc: "CAT200918D91",
                    logo: "/uploads/logos/cloudaxis.png",
                    country: "Mexico",
                    state: "Jalisco",
                    city: "Guadalajara",
                    zip_code: "44100",
                    street: "Av. Vallarta",
                    street_number: "2222",
                    contact_email: "hr@cloudaxis.mx",
                    contact_phone: "3312348899",
                    isApproved: "approved",
                    description: "Cloud infrastructure and DevOps consulting firm.",
                    isActive: true,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                {
                    name: "Innova Systems Group",
                    rfc: "ISG210731F55",
                    logo: "/uploads/logos/innova.png",
                    country: "Mexico",
                    state: "Chihuahua",
                    city: "Ciudad Juárez",
                    zip_code: "32000",
                    street: "Av. Paseo Triunfo",
                    street_number: "1020",
                    contact_email: "jobs@innovasystems.mx",
                    contact_phone: "6567782211",
                    isApproved: "rejected",
                    description: "IT consulting and digital transformation services.",
                    isActive: false,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            console.log('Jobs creados correctamente');
        }
    } catch (error) {
        console.error('Error al crear jobs:', error);
    }
};