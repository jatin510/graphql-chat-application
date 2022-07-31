const port: string | number = process.env.PORT || 4000;

const startServer = async () => {
  const { default: app } = await import('./app/main');

  app.listen(port, () =>
    console.log(`The server is running on http://localhost:${port}`)
  );
};

startServer();
