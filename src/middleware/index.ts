import { _Ayioo } from './../index';
import { IncomingMessage, ServerResponse } from "http";

import {Ayioo} from '../index';


export interface _AyiooCatchOptions {
    token:string,
    channelId: string,
    instance?: _Ayioo

}

const AyiooCatch = (options: Readonly<_AyiooCatchOptions>) =>{

    const {token,channelId,instance} = options;

    if(!instance){
        Ayioo.configure(token,channelId);
    }

    const log = (_req:IncomingMessage, _res:ServerResponse, _errorMessage:string, _reqStart:number, _body:any) => {
    const { rawHeaders, httpVersion, method, socket, url } = _req;
    const { remoteAddress, remoteFamily } = socket;

    const { statusCode, statusMessage } = _res;
    const headers = _res.getHeaders();


    Ayioo.error(      JSON.stringify({
            timestamp: Date.now(),
            processingTime: Date.now() - _reqStart,
            rawHeaders,
            body:_body,
            errorMessage:_errorMessage,
            httpVersion,
            method,
            remoteAddress,
            remoteFamily,
            url,
            response: {
                statusCode,
                statusMessage,
                headers
            }
        }))

    console.log(
        JSON.stringify({
            timestamp: Date.now(),
            processingTime: Date.now() - _reqStart,
            rawHeaders,
            body:_body,
            errorMessage:_errorMessage,
            httpVersion,
            method,
            remoteAddress,
            remoteFamily,
            url,
            response: {
                statusCode,
                statusMessage,
                headers
            }
        })
      );
    };
    
    
    return (_req:IncomingMessage,_res:ServerResponse,next:()=>void)=>{

            const _reqStart:number = Date.now();

            let body:any = [];
            let _reqErrorMessage:string = null;

            const getChunk = chunk => body.push(chunk);
            const assembleBody = () => {
                body = Buffer.concat(body).toString();
            };
            const getError = error => {
                _reqErrorMessage = error.message;
            };
            _req.on("data", getChunk);
            _req.on("end", assembleBody);
            _req.on("error", getError);

            const logClose = () => {
                removeHandlers();
                log(_req, _res, "Client aborted.", _reqStart, body);
            };
            const logError = error => {
                removeHandlers();
                log(_req, _res, error.message, _reqStart, body);
            };
            const logFinish = () => {
                removeHandlers();
                log(_req, _res, _reqErrorMessage, _reqStart, body);
            };
            _res.on("close", logClose);
            _res.on("error", logError);
            _res.on("finish", logFinish);

            const removeHandlers = () => {
                _req.off("data", getChunk);
                _req.off("end", assembleBody);
                _req.off("error", getError);
                _res.off("close", logClose);
                _res.off("error", logError);
                _res.off("finish", logFinish);
            };


            next();
    }
}

export default AyiooCatch;