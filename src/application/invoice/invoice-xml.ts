export type InvoiceXml = {
    nfeProc: NfeProc
  }
  
  export type NfeProc = {
    NFe: Nfe
    protNFe: ProtNfe
  }
  
  export type Nfe = {
    infNFe: InfNfe
    Signature: Signature
  }
  
  export type InfNfe = {
    ide: Ide
    emit: Emit
    dest: Dest
    det: Det[]
    total: Total
    transp: Transp
    cobr: Cobr
    pag: Pag
    infAdic: InfAdic
  }
  
  export type Ide = {
    cUF: number
    cNF: number
    natOp: string
    mod: number
    serie: number
    nNF: number
    dhEmi: string
    dhSaiEnt: string
    tpNF: number
    idDest: number
    cMunFG: number
    tpImp: number
    tpEmis: number
    cDV: number
    tpAmb: number
    finNFe: number
    indFinal: number
    indPres: number
    indIntermed: number
    procEmi: number
    verProc: string
  }
  
  export type Emit = {
    CNPJ: number
    xNome: string
    xFant: string
    enderEmit: EnderEmit
    IE: number
    CRT: number
  }
  
  export type EnderEmit = {
    xLgr: string
    nro: string
    xCpl: string
    xBairro: string
    cMun: number
    xMun: string
    UF: string
    CEP: number
    cPais: number
    xPais: string
    fone: number
  }
  
  export type Dest = {
    CNPJ: number
    xNome: string
    enderDest: EnderDest
    indIEDest: number
    IE: number
    email: string
  }
  
  export type EnderDest = {
    xLgr: string
    nro: number
    xBairro: string
    cMun: number
    xMun: string
    UF: string
    CEP: number
    cPais: number
    xPais: string
    fone: number
  }
  
  export type Det = {
    prod: Prod
    imposto: Imposto
    infAdProd: string
  }
  
  export type Prod = {
    cProd: number
    cEAN: number
    xProd: string
    NCM: number
    CEST: number
    CFOP: number
    uCom: string
    qCom: number
    vUnCom: number
    vProd: number
    cEANTrib: number
    uTrib: string
    qTrib: number
    vUnTrib: number
    vDesc: number
    vOutro: number
    indTot: number
    rastro: Rastro
    med: Med
  }
  
  export type Rastro = {
    nLote: any
    qLote: number
    dFab: string
    dVal: string
  }
  
  export type Med = {
    cProdANVISA: number
    vPMC: number
  }
  
  export type Imposto = {
    vTotTrib: number
    ICMS: Icms
    IPI: Ipi
    PIS: Pis
    COFINS: Cofins
  }
  
  export type Icms = {
    ICMS30: Icms30
  }
  
  export type Icms30 = {
    orig: number
    CST: number
    modBCST: number
    pRedBCST: number
    vBCST: number
    pICMSST: number
    vICMSST: number
  }
  
  export type Ipi = {
    cEnq: number
    IPITrib: Ipitrib
  }
  
  export type Ipitrib = {
    CST: number
    vBC: number
    pIPI: number
    vIPI: number
  }
  
  export type Pis = {
    PISNT: Pisnt
  }
  
  export type Pisnt = {
    CST: number
  }
  
  export type Cofins = {
    COFINSNT: Cofinsnt
  }
  
  export type Cofinsnt = {
    CST: number
  }
  
  export type Total = {
    ICMSTot: Icmstot
  }
  
  export type Icmstot = {
    vBC: number
    vICMS: number
    vICMSDeson: number
    vFCPUFDest: number
    vICMSUFDest: number
    vICMSUFRemet: number
    vFCP: number
    vBCST: number
    vST: number
    vFCPST: number
    vFCPSTRet: number
    vProd: number
    vFrete: number
    vSeg: number
    vDesc: number
    vII: number
    vIPI: number
    vIPIDevol: number
    vPIS: number
    vCOFINS: number
    vOutro: number
    vNF: number
    vTotTrib: number
  }
  
  export type Transp = {
    modFrete: number
    transporta: Transporta
    vol: Vol
  }
  
  export type Transporta = {
    CNPJ: number
    xNome: string
    IE: number
    xEnder: string
    xMun: string
    UF: string
  }
  
  export type Vol = {
    qVol: number
    esp: string
    pesoL: number
    pesoB: number
  }
  
  export type Cobr = {
    fat: Fat
    dup: Dup[]
  }
  
  export type Fat = {
    nFat: number
    vOrig: number
    vDesc: number
    vLiq: number
  }
  
  export type Dup = {
    nDup: number
    dVenc: string
    vDup: number
  }
  
  export type Pag = {
    detPag: DetPag
  }
  
  export type DetPag = {
    indPag: number
    tPag: number
    vPag: number
  }
  
  export type InfAdic = {
    infCpl: string
  }
  
  export type Signature = {
    SignedInfo: SignedInfo
    SignatureValue: string
    KeyInfo: KeyInfo
  }
  
  export type SignedInfo = {
    CanonicalizationMethod: string
    SignatureMethod: string
    Reference: Reference
  }
  
  export type Reference = {
    Transforms: Transforms
    DigestMethod: string
    DigestValue: string
  }
  
  export type Transforms = {
    Transform: string[]
  }
  
  export type KeyInfo = {
    X509Data: X509Data
  }
  
  export type X509Data = {
    X509Certificate: string
  }
  
  export type ProtNfe = {
    infProt: InfProt
  }
  
  export type InfProt = {
    tpAmb: number
    verAplic: string
    chNFe: number
    dhRecbto: string
    nProt: number
    digVal: string
    cStat: number
    xMotivo: string
  }
