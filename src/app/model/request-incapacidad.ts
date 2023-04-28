import { RequestDocumento } from "./request-documento";

export class RequestIncapacidad {
    azCodigo:string;
    deaCodigo:string;
    contrato:string;
    fecha:string;
    numeroDocumentoEmpleado:string;
    tipoACargar:string;
    TipoAccion:string;
    documentos:RequestDocumento[];
}
