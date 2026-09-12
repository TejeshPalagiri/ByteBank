import mongoose, { mongo } from 'mongoose';
import * as config from '../index';
import logger from '../../utils/logger';


const connectionURI = `mongodb+srv://${config.MONGO_DB_USER}:${config.MONGO_DB_PASSWORD}@${config.MONGO_DB_HOST}/${config.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(connectionURI, { 
    autoIndex: true
})

mongoose.set('debug', process.env.NODE_ENV === 'development');
// mongoose.set("sanitizeFilter", true);
mongoose.set("allowDiskUse", true);

mongoose.connection.on('open', () => {
    logger.info('Mongo Connected');
});



// /** On Mongo connection error */
mongoose.connection.on('error', (error) => {
    logger.error({ error }, 'Error in connecting MongoDB');
    setTimeout(function () {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(connectionURI);
        }
    }, 1000);
});


// /** On Mongo disconnect */
mongoose.connection.on('disconnected', (error) => {
    // Retrying to connect to mongo db of disconnected
    logger.warn('Mongo got disconnected.');
});

mongoose.connection.on('close', () => {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
})

/* If the Node process ends, close the Mongoose connection **/
process.on('SIGINT', () => {
    mongoose.connection.close(true);
});