export class Incapacidad {
    tdcTd:string;               //Tipo documento entidad que expide la incapacidad.
    empNd:number;               //Numero documento entidad que expide la incapacidad.
    incSerie:string;            //Serie Incapacidad.
    incNumero:number;           //Numero Incapacidad.
    tdcTdEpl:string;            //Tipo identificacion del trabajador.
    eplNd:number;               //Numero de identificacion del trabajador.
    tdcTdPal:string;            //Tipo de identificacion de la empresa principal.
    empNdPal:number;            //Numero de identificacion de la empresa principal.
    ctoNumero:number;           //Numero del contrato.
    incTipo:string;
    incFecAcc:Date;             //Fecha de Accidente de Trabajo.    
    incFecIni:Date;             //Fecha Inicio Incapacidad.
    incDias:number;             //Numero de Dias Incapacidad.
    incFecFin:Date;             //Fecha Hasta Incapacidad.
    incProrro:string;           //Prorroga S si o N no.
    incRadicacion:number;       //Radicacion incapacidad.
    incEstado:string;           //Estado de la incapacidad.
    incFecFueroMat:Date;        //Fecha fuero materno.
}
