exports.uncaughtException = () => {
    process.on('uncaughtException', err => {
        console.log('Uncaught Exception! Shutting down ...');
        console.log(err.name, err.message);
    });
}

exports.unhandledRejection = (server) => {
    process.on('unhandledRejection', err => {
        console.log('Unhandled Rejection! Shutting down ...');
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
}