import AWS from "aws-sdk";
import * as config from "../../config";
import * as _ from "lodash";


AWS.config.update({
    accessKeyId: config.AWS.S3.ACCESS_KEY,
    secretAccessKey: config.AWS.S3.SECRET,
    region: config.AWS.S3.REGION
});

export interface FILE_UPLOAD_PARAMS {
    key: string;
    mimeType: string;
}

const s3 = new AWS.S3();

export const getUploadPresignedUrl = (uploadParams: FILE_UPLOAD_PARAMS) => {
    const params = {
        Bucket: config.AWS.S3.BUCKET,
        Key: uploadParams.key,
        ContentType: uploadParams.mimeType
    };

    return s3.getSignedUrl("putObject", params);
}

export const getFilePresignedURl = (key: string, expires: number = 36000) => {
    const params = {
        Bucket: config.AWS.S3.BUCKET,
        Key: key,
        Expires: expires
    };

    return s3.getSignedUrl("getObject", params);
}

export const uploadFile = async (key: string, body: Buffer, contentType?: string) => {
    const params: any = {
        Bucket: config.AWS.S3.BUCKET,
        Key: key,
        Body: body
    };

    if(contentType) {
        params["ContentType"] = contentType;
        params["ContentEncoding"] = "base64";
    }

    return new Promise((resolve, reject) => {
        s3.upload(params, (err: any, data: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export const createFolderInBucket = (key: string, isDelete: boolean = false) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: config.AWS.S3.BUCKET,
            Key: key
        }

        if(isDelete) {
            s3.deleteObject(params, (err, res) => {
                if(!_.isEmpty(err)) {
                    reject(err)
                }
                resolve(res);
            });
        } else {
            s3.putObject(params, (err, res) => {
                if(!_.isEmpty(err)) {
                    reject(err)
                }
                resolve(res);
            });
        }
    
    })
}