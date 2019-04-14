////////////////////////////////////////////////////////
// Example Datasource Implementation
//
// COMMENTS datasource, based from example @ 
// https://github.com/christiannwamba/scotch-ng2-http
//
// Gavin Mogensen
////////////////////////////////////////////////////////

import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { ICallback } from './callback.interface';

export interface Comment {
    id: number,
    author: string;
    text: string;
}

export class CommentsDatasource {
    private comments:Comment[] = new Array<Comment>();
    private DEBUG:boolean = false;
    private mockFilePath:string = '';

    constructor(useMockData?:boolean) {
        if (useMockData) {
            this.mockFilePath = path.join(__dirname, 'comments.mock-data.json');
            console.log("opening MOCK data file @", this.mockFilePath);
            this.DEBUG = useMockData;
            this.loadMockComments();
        }
    }

    /////////////////////////////////////////////////////////////////////////
    // public interface methods
    /////////////////////////////////////////////////////////////////////////
    public getComments( callback:ICallback ) {
        if( this.DEBUG ) {
            this.getComments_MOCK(callback);
        } else {
            let msg:string = 'Error: No database implementation for GET available - pass "true" as constructor param to datasource to use MOCK data';
            let error:Error = new Error(msg);
            callback(error, JSON.stringify(error.message) );
        }
    }

    public postComment( req:Request, callback:ICallback ) {
        if( this.DEBUG ) {
            this.postComment_MOCK(req, callback);
        } else {
            let msg:string = 'Error: No database implementation for POST available - pass "true" as constructor param to datasource to use MOCK data';
            let error:Error = new Error(msg);
            callback(error, JSON.stringify(error.message) );
        }
    }

    public putComment(req:Request, callback:ICallback) {
        if( this.DEBUG ) {
            this.putComment_MOCK(req, callback);
        } else {
            let msg:string = 'Error: No database implementation for PUT available - pass "true" as constructor param to datasource to use MOCK data';
            let error:Error = new Error(msg);
            callback(error, JSON.stringify(error.message) );
        }
    }

    public deleteComment(req:Request, callback:ICallback) {
        if( this.DEBUG ) {
            this.deleteComment_MOCK(req, callback);
        } else {
            let msg:string = 'Error: No database implementation for DELETE available - pass "true" as constructor param to datasource to use MOCK data';
            let error:Error = new Error(msg);
            callback(error, JSON.stringify(error.message) );
        }
    }

    /////////////////////////////////////////////////////////////////////////
    // Private DATABASE methods
    /////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////
    // Private MOCK methods
    /////////////////////////////////////////////////////////////////////////
    private loadMockComments() {
        fs.readFile(this.mockFilePath, (err:Error, data:any) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            this.comments = JSON.parse(data);
        });
    }

    private getComments_MOCK( callback:ICallback) { 
        fs.readFile(this.mockFilePath, (err:Error, data:any) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            callback(err, data);
        });
    };

    private postComment_MOCK( req:Request, callback:ICallback ) {
        let newComment:Comment = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text,
        };
        this.comments.push(newComment);
        fs.writeFile(this.mockFilePath, JSON.stringify(this.comments, null, 4), (err:Error) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            callback(err, this.comments);
        });
    }

    private putComment_MOCK( req:Request, callback:ICallback ) {
        let idIndex = 0;
        let findCommentById = this.comments.filter( (comment:Comment) => {
            if(comment.id == req.params.id) {
                idIndex = this.comments.indexOf(comment);
                return comment;
            }
        });
        findCommentById[0].text = req.body.text;
        findCommentById[0].author = req.body.author;

        this.comments.splice(idIndex, 1, findCommentById[0]);
        fs.writeFile(this.mockFilePath, JSON.stringify(this.comments, null, 4), (err:Error) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            callback(err, this.comments);
        });
    }

    private deleteComment_MOCK(req:Request, callback:ICallback) {
        let idIndex:number = 0;
        let findCommentById = this.comments.filter( (comment:Comment) => {
            if(comment.id == req.params.id) {
                idIndex = this.comments.indexOf(comment);
                return comment;
            }
        });

        if(idIndex >= 0){
            this.comments.splice(idIndex, 1);
        }

        fs.writeFile(this.mockFilePath, JSON.stringify(this.comments, null, 4), (err:Error) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            callback(err, this.comments);
        });
    }
    // End of class 'CommentsDatasource'

}
