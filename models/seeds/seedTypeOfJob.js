const TypeOfJob = require("../typeOfJobModel");

exports.seedTypeOfJob = async () => {
    try {
        const count = await TypeOfJob.count();

        if (count === 0) {
            await TypeOfJob.bulkCreate([
                { name: 'Tiempo completo' },
                { name: 'Medio tiempo' },
                { name: 'Prácticas' },
                { name: 'Servicio social' }
            ]);
            console.log('Tipo de trabajo creados correctamente');
        }
    } catch (error) {
        console.error('Error al crear tipo de trabajo:', error);
    }
};
