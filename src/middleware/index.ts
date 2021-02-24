import { _Ayioo } from '../logger/index';
import { IncomingMessage, ServerResponse } from "http";

import {Ayioo} from '../logger/index';


export interface _AyiooCatchOptions {
    token:string,
    channelId: string,
    instance?: boolean

}

export const AyiooCatch = (options: Readonly<_AyiooCatchOptions>) =>{

    const {token,channelId,instance} = options;

    if(!instance){
        Ayioo.configure({
            token,
            channelID: channelId
        });
    }

    const log = (_req:IncomingMessage, _res:ServerResponse, _errorMessage:string, _reqStart:number, _body:any) => {
    const { rawHeaders, httpVersion, method, socket, url } = _req;
    let { remoteAddress, remoteFamily } = socket;
    remoteAddress = JSON.stringify(remoteAddress);
    remoteFamily = JSON.stringify(remoteFamily);
    const { statusCode, statusMessage } = _res;
    let headers = JSON.stringify(_res.getHeaders());

    const processingTime = Date.now() - _reqStart;
        
    let logMessage:string;

    if(_errorMessage){
        logMessage = `X-[${new Date().toUTCString()}]~${statusCode}~${statusMessage}~${new Date(processingTime).getSeconds()}secs-${method}->${url}-httpV:${ httpVersion}-headers:${rawHeaders}-body:${_body}-error-msg:${_errorMessage}-${remoteAddress}-${remoteFamily}-responseHeaders:${headers}`
         Ayioo.error(logMessage);

    }else if(statusCode===404){
        logMessage = `X-[${new Date().toUTCString()}]~${statusCode}~${statusMessage}~${new Date(processingTime).getSeconds()}secs-${method}->${url}-httpV:${ httpVersion}-headers:${rawHeaders}-body:${_body}-${remoteAddress}-${remoteFamily}-responseHeaders:${headers}`
         Ayioo.warn(`${logMessage}`);
    }else {
        logMessage = `X-[${new Date().toUTCString()}]~${statusCode}~${statusMessage}~${new Date(processingTime).getSeconds()}secs-${method}->${url}-httpV:${ httpVersion}-headers:${rawHeaders}-body:${_body}-error-msg:${_errorMessage}-${remoteAddress}-${remoteFamily}-responseHeaders:${headers}`
         Ayioo.log(logMessage);
    }

   

    };
    
    
    return (_req:IncomingMessage,_res:ServerResponse,next:()=>void)=>{

            const _reqStart:number = Date.now();

            let body:any = [];
            let _reqErrorMessage:string = "";

            const getChunk = (chunk:any) => body.push(chunk);
            const assembleBody = () => {
                body = Buffer.concat(body).toString();
            };
            const getError = (error:any) => {
                _reqErrorMessage = error.message;
            };
            _req.on("data", getChunk);
            _req.on("end", assembleBody);
            _req.on("error", getError);

            const logClose = () => {
                removeHandlers();
                log(_req, _res, "Client aborted.", _reqStart, body);
            };
            const logError = (error:any) => {
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
