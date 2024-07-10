import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

interface FileWithPreview extends File {
    preview: string;
  }
  
// Get the environment variables
const region_AWS = process.env.NEXT_PUBLIC_AWS_REGION ?? ""
const accessKeyId_AWS = process.env. NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? ""
const secretAccessKey_AWS = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? ""
const bucketName_AWS = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME

const s3 = new S3Client({
  region: region_AWS,
  credentials: {
    accessKeyId: accessKeyId_AWS,
    secretAccessKey: secretAccessKey_AWS
  }
});

const uploadToS3 = async (file: FileWithPreview): Promise<string> => {
  const params = {
    Bucket: bucketName_AWS,
    Key: `${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const location = `https://${params.Bucket}.s3.${region_AWS}.amazonaws.com/${params.Key}`;
  return location;
};

export default uploadToS3