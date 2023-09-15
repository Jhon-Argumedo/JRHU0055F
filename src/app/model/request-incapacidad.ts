import { RequestDocumento } from "./request-documento";

export class RequestIncapacidad {
    tipoDocumentoEmpleado: string;
    numeroDocumentoEmpleado: number;
    numeroDocumentoEmpresaPrincipal: number;
    tipoDocumentoEmpresaPrincipal: string;
    contrato: number;
    idGrupoEnfermedad: number;
    idSubGrupoEnfermedad: number;
    idCodigoEnfermedad: string;
    idContigenciaIncapacidad: number;
    idSubTipoContigencia: number;
    fechaIncidente: string;
    fechaFueroMaterno:string;
    fechaInicioIncapacidad: string;
    numeroDeDias: number;
    numeroIncapacidad:number;
    prorroga: string;
    idUsuarioCrea: number;
    azCodigo: string;
    deaCodigo: string;
    tipoACargar: string;
    direccionIp:string;
    documentosACargar: RequestDocumento[];
}
