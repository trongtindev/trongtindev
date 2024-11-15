export interface IAuth {
  userId: string;
  package: {
    aiGenCount: number;
    expiredAt: number;
  };
  expires: number;
}
