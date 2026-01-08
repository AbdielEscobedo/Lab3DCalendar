const { sequelize, Equipment, User } = require('./models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        // Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Administrador',
            matricula: 'ADMIN001',
            role: 'admin',
            password: hashedPassword
        });

        // Create Student User (Demo)
        const studentPassword = await bcrypt.hash('student123', 10);
        await User.create({
            name: 'Estudiante Demo',
            matricula: 'A01234567',
            role: 'student',
            password: studentPassword
        });

        // Create Equipment
        const equipmentList = [
            { name: 'Creality Ender 3V3 KE - 1', type: 'printer' },
            { name: 'Creality Ender 3V3 KE - 2', type: 'printer' },
            { name: 'Creality Ender 3V3 KE - 3', type: 'printer' },
            { name: 'Creality K1 Combo - 1', type: 'printer' },
            { name: 'Creality K1 Combo - 2', type: 'printer' },
            { name: 'Cortadora Láser', type: 'laser' },
            { name: 'Impresora 3D Stratasys', type: 'printer' },
            { name: 'Escáner 3D Raptor Pro - 1', type: 'scanner' },
            { name: 'Escáner 3D Raptor Pro - 2', type: 'scanner' }
        ];

        await Equipment.bulkCreate(equipmentList);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
