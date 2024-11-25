import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL
} from '@aws-sdk/client-s3';

export const getS3Client = () => {
  const { S3_KEY, S3_SECRET, S3_REGION, S3_ENDPOINT } = useRuntimeConfig();
  return new S3Client({
    credentials: {
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SECRET
    },
    region: S3_REGION,
    endpoint: S3_ENDPOINT
  });
};

export const uploadS3Object = async (
  data: string,
  key: string,
  acl?: ObjectCannedACL | undefined
) => {
  const { S3_BUCKET } = useRuntimeConfig();
  const client = getS3Client();
  const command = new PutObjectCommand({
    Key: key,
    Body: data,
    Bucket: S3_BUCKET,
    ACL: acl
  });
  await client.send(command);
};
