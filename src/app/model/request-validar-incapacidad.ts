import { ContratoDTO } from "./contrato-dto";

export class RequestValidarIncapacidad {
    numeroDeDias:number;
    numeroContrato:number;
    fechaAccidente:string;
    idContigenciaIncapacidad:number;
    contratoDTO:ContratoDTO;
    fechaInicio:string;

    constructor(numeroDeDias:number, numeroContrato:number, fechaAccidente:string, idContigenciaIncapacidad:number, contratoDTO:ContratoDTO, fechaInicio:string) {
        this.numeroDeDias = numeroDeDias;
        this.numeroContrato = numeroContrato;
        this.fechaAccidente = fechaAccidente;
        this.idContigenciaIncapacidad = idContigenciaIncapacidad;
        this.contratoDTO = contratoDTO;
        this.fechaInicio = fechaInicio;
    }
}
