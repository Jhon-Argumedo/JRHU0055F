import { DocumentoAlmacenado } from "./documento-almacenado";

export class ResponseRadicarIncapacidad {
    mensaje:string;
    status:string;
    resultadoSubidaDocumentos:string;
    listaResultados:DocumentoAlmacenado[];
}
