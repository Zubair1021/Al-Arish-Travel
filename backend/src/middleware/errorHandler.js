export function notFound(_req, res) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.publicMessage || "Server error",
  });
}
