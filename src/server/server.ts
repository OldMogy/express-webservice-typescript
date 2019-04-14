////////////////////////////////////////////////////////
// Example Express Server Implementation
//
// Uses COMMENTS datasource, based from example @ 
// https://github.com/christiannwamba/scotch-ng2-http
//
// Gavin Mogensen
// Hitachi Rail STS (c) 2019
////////////////////////////////////////////////////////


import express from 'express';
import bodyParser from 'body-parser';
import { CommentsDatasource } from '../data/comments.datasource';

export class Server { 
    private app:express.Application;
    private port:number = 4647;
    private dataSource:CommentsDatasource;

    constructor(){
        this.dataSource = new CommentsDatasource(true); // true indicates to use MOCK data
        this.app = express();
    }

    public run(){
        this.configureApp();
        this.configureCORS()
        this.configureRoutes();
        this.listen();
    }

    private listen(){
        this.app.listen(this.port, () => {
            console.log(`Server started: http://localhost:${this.port}/`);
        });
    }

    private configureApp() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    // Security for Cross Site Scripting
    private configureCORS(){
        // Additional middleware which will set headers that we need on each request.
        this.app.use((req, res, next) => {
            // Set permissive CORS header - this allows this server to be used only as
            // an API server in conjunction with something like webpack-dev-server.
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

            // Disable caching so we'll always get the latest comments.
            res.setHeader('Cache-Control', 'no-cache');
            next();
        });
    }

    // Webservice Routes API
    private configureRoutes(){
        
        // GET end-point
        this.app.get('/api/comments', (req, res) => {
            this.dataSource.getComments( (error:Error, data?:any) => {
                if( error ) {
                    console.log('GET error:', error.message);
                }
                if( data ) {
                    res.json( JSON.parse(data));
                }
            });
        });

        // POST end-point
        this.app.post('/api/comments', (req, res) => {
            this.dataSource.postComment(req, (error:Error, data?:any) => {
                if( error ) {
                    console.log('POST error:', error.message);
                }
                if( data ) {
                    res.json( JSON.parse(data));
                }

            })
        });

        // PUT end-point
        this.app.put('/api/comments/:id', (req, res) => {
            this.dataSource.putComment(req, (error:Error, data?:any) => {
                if( error ) {
                    console.log('PUT error:', error.message);
                }
                if( data ) {
                    res.json( JSON.parse(data));
                }

            })
        });

        // DELETE end-point
        this.app.delete('/api/comments/:id', (req, res) => {
            this.dataSource.deleteComment(req, (error:Error, data?:any) => {
                if( error ) {
                    console.log('DELETE error:', error.message);
                }
                if( data ) {
                    res.json( JSON.parse(data));
                }
            })
        });
    }
}


