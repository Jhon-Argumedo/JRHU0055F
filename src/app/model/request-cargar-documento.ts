import { RequestDocumento } from './request-documento';

export class RequestCargarDocumento {
    numeroRadicado:number;
    estadoRadicado:string;
    tipoACargar:string;
    documentosACargar:RequestDocumento[];
}
