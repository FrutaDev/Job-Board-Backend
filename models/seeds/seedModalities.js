const Modality = require("../modalityModel");

exports.seedModalities = async () => {
    try {
        const count = await Modality.count();

        if (count === 0) {
            await Modality.bulkCreate([
                { name: 'Presencial' },
                { name: 'Remoto' },
                { name: 'Híbrido' }
            ]);
            console.log('Modalidades creadas correctamente');
        }
    } catch (error) {
        console.error('Error al crear modalidades:', error);
    }
};
