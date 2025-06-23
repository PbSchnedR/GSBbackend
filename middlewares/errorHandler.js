const errorHandler = (err, req, res, next) => {
  console.error(err); // log complet de l'erreur (utile pour le dev)

  const status = err.statusCode || 500;
  const message = err.message || "Une erreur interne s'est produite.";

  res.status(status).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;