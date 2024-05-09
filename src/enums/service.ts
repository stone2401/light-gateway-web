export enum serviceLoadType {
  HTTP = 'HTTP',
  RPC = 'RPC',
  TCP = 'TCP',
  UDP = 'UDP',
}

export function serviceLoadTypeMap(type: serviceLoadType) {
  switch (type) {
    case serviceLoadType.HTTP:
      return 'http';
    case serviceLoadType.RPC:
      return 'rpc';
    case serviceLoadType.TCP:
      return 'tcp';
    case serviceLoadType.UDP:
      return 'udp';
  }
}

export function serviceLoadTypeMapReverse(type: number) {
  switch (type) {
    case 0:
      return serviceLoadType.HTTP;
    case 1:
      return serviceLoadType.RPC;
    case 2:
      return serviceLoadType.TCP;
    case 3:
      return serviceLoadType.UDP;
  }
}
