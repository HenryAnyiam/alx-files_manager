/* eslint-disable */
const express = require('express');
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = (app) => {
    const routes = express.Router();
    app.use(express.json());
    app.use('/', routes)

    routes.get('/status', ((req, res) => AppController.getStatus(req, res)));
    routes.get('/stats', ((req, res) => AppController.getStats(req, res)));
    routes.post('/users', ((req, res) => UsersController.postNew(req, res)));
    routes.get('/connect', ((req, res) => AuthController.getConnect(req, res)));
    routes.get('/disconnect', ((req, res) => AuthController.getDisconnect(req, res)));
    routes.get('/users/me', ((req, res) => UsersController.getMe(req, res)));
    routes.post('/files', ((req, res) => FilesController.postUpload(req, res)));
    routes.get('/files/:id', ((req, res) => FilesController.getShow(req, res)));
    routes.get('/files', ((req, res) => FilesController.getIndex(req, res)));
    routes.put('/files/:id/publish', ((req, res) => FilesController.putPublish(req, res)));
    routes.put('/files/:id/unpublish', ((req, res) => FilesController.putUnpublish(req, res)));
    routes.get('/files/:id/data', ((req, res) => FilesController.getFile(req, res)));
}

export default router;