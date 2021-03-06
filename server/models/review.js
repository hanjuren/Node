const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model{
    static init(sequelize) {
        return super.init( {
            comment: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            satisfaction: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Review.belongsTo(db.Host);
        db.Review.belongsTo(db.User);
        db.Review.belongsTo(db.Reservation);
    }
};