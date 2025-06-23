const testController = async (req, res, next) => {
    try {
        
        throw new Error('Erreur serveur simulée');

        // Cas succès avec données
        res.status(200).json({
            message: 'Notes de frais récupérées avec succès',
            bills: bills,
        });
    } catch (error) {
        next(error)
    }
};

module.exports = testController