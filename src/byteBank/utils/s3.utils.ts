import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  DeleteObjectCommandInput
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as config from "../../config";

export interface FILE_UPLOAD_PARAMS {
  key: string;
  mimeType: string;
}

const s3 = new S3Client({
  region: config.AWS.S3.REGION || process.env.AWS_REGION
});

export const getUploadPresignedUrl = (
  uploadParams: FILE_UPLOAD_PARAMS
) => {
  const command = new PutObjectCommand({
    Bucket: config.AWS.S3.BUCKET,
    Key: uploadParams.key,
    ContentType: uploadParams.mimeType,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const getFilePresignedURl = (
  key: string,
  expires: number = 36000
) => {
  const command = new GetObjectCommand({
    Bucket: config.AWS.S3.BUCKET,
    Key: key
  });

  return getSignedUrl(s3, command, { expiresIn: expires });
};

export const uploadFile = async (
  key: string,
  body: Buffer,
  contentType?: string
) => {
  const params: any = {
    Bucket: config.AWS.S3.BUCKET,
    Key: key,
    Body: body
  };

  if (contentType) {
    params.ContentType = contentType;
    params.ContentEncoding = "base64";
  }

  const command = new PutObjectCommand(params);

  return await s3.send(command);
};

export const createFolderInBucket = async (
  key: string,
  isDelete: boolean = false
) => {
    const commandProps: DeleteObjectCommandInput = {
        Bucket: config.AWS.S3.BUCKET,
        Key: key
    }
  if (isDelete) {
    const command = new DeleteObjectCommand(commandProps);

    return await s3.send(command);
  }

  const command = new PutObjectCommand(commandProps);

  return s3.send(command);
};