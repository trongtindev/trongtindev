export interface IAuth {
  userId: string;
  expires: number;
  tokenType: 'bearer';
}

export interface IPlan {
  userId: string;
  package: {
    aiGenCount: number;
    expiredAt: number;
  };
  expires: number;
}
