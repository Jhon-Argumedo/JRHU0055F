export class RequestIncapacidadesUsuario {
    tipoDocumentoEmpleado:string;
    documentoEmpleado:number;
    tipoDocumentoEmpresa:string;
    documentoEmpresa:number;

    constructor(tipoDocumentoEmpleado:string, documentoEmpleado:number, tipoDocumentoEmpresa:string, documentoEmpresa:number) {
        this.tipoDocumentoEmpleado = tipoDocumentoEmpleado;
        this.documentoEmpleado = documentoEmpleado;
        this.tipoDocumentoEmpresa = tipoDocumentoEmpresa;
        this.documentoEmpresa = documentoEmpresa;
    }
}
