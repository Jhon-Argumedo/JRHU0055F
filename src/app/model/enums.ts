export enum SesionDataEnum {
    usuarioSesion = 'usuarioSesion',
    requestIncapacidad = 'requestIncapacidad',
    tipoIncapacidad = 'tipoIncapacidad',
    subtipoIncapacidad = 'subtipoIncapacidad',
    incapacidadDevuelta = 'incapacidadDevuelta',
    checkObservacion = 'checkObservacion'
}

export enum TipoIncapacidadEnum {
    ACCIDENTE_LABORAL = 'ACCIDENTE LABORAL',
    ENFERMEDAD_LABORAL = 'ENFERMEDAD LABORAL',
    LICENCIA_MATERNIDAD_PATERNIDAD = 'LICENCIA MATERNIDAD, ABORTO Y PATERNIDAD',
    ENFERMEDAD_GENERAL = 'ENFERMEDAD GENERAL'
}

export enum EstadosDocumentoCargadoEnum {
    no_cargado = 'No cargado',
    Cargado = 'Cargado'
}

export enum EmpresasPrincipalesEnum {
    ACTIVOS = 'ACTIVOS',
    SERVIOLA = 'SERVIOLA',
    ATECNO = 'ATECNO'
}

export enum EstadosDocumentoEnum {
    SIN_VALIDAR = 'SIN_VALIDAR',
    APROBADO = 'APROBADO',
    RECHAZADO = 'RECHAZADO'
}

export enum EstadosRadicadoEnum {
    CPT = 'CPT',
    CAP = 'CAP',
    PEN = 'PEN',
    APR = 'APR',
    REH = 'REH',
    ANU = 'ANU',
    DEV = 'DEV',
    RAT = 'RAT',
    RNN = 'RNN',
    INR = 'INR',
    INP = 'INP',
    RIN = 'RIN',
    RRI = 'RRI'
}

export enum EstadosPortalTrabajadorEnum {
    Radicada = 'Radicada',
    En_transcripcion = 'En transcripcion',
    Auditoria_interna_o_externa = 'Auditoria interna o externa',
    Devolución = 'Devolucion',
    En_estudio = 'En estudio',
    Proceso_declinado = 'Proceso declinado'
}