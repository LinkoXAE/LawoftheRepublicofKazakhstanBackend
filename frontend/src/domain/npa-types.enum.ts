export enum NpaTypeKZ {
  CONSTITUTION = 'Constitution',      
  CONSTITUTIONAL_LAW = 'ConstitutionalLaw', 
  CODE = 'Code',                     
  LAW = 'Law',                          
  DECREE = 'Decree',                 
  RESOLUTION = 'Resolution',
  ORDER = 'Order'                       
}

export const KZ_LAW_HIERARCHY: Record<NpaTypeKZ, number> = {
  [NpaTypeKZ.CONSTITUTION]: 100,
  [NpaTypeKZ.CONSTITUTIONAL_LAW]: 90,
  [NpaTypeKZ.CODE]: 80,
  [NpaTypeKZ.LAW]: 70,
  [NpaTypeKZ.DECREE]: 60,
  [NpaTypeKZ.RESOLUTION]: 50,
  [NpaTypeKZ.ORDER]: 40,
};