import boto3

client = boto3.client(
    's3',
    region_name=os.environ.get('DO_S3_REGION_NAME'),
    endpoint_url=os.environ.get('DO_S3_ENDPOINT_URL'),
    aws_access_key_id=os.environ.get('DO_S3_ACCESS_KEY'),
    aws_secret_access_key=os.environ.get('DO_S3_SECRET_KEY')
)

last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))

data = client.list_objects_v2(Bucket=os.environ.get('DO_S3_BACKUP_BUCKET'))['Contents']

file_name = [obj['Key'] for obj in sorted(data, key=last_modified, reverse=True)][0]

client.download_file(os.environ.get('DO_S3_BACKUP_BUCKET'), file_name, 'pg_backup.tgz.gpg')