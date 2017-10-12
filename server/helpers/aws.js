const AWS = require('aws-sdk');
const secrets = require('../config/aws');
// s3.getObject({Bucket: 'bucketName', Key: 'keyName'});
AWS.config.update({
  accessKeyId: secrets.AWS_ACCESS_KEY_ID,
  secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
  "region": "us-west-1"
});

const s3bucket = new AWS.S3({params: {Bucket: 'hrsf81-grazers'}, apiVersion: '2006-03-01' });
let keyname = '141733.png';
let promise = s3bucket.getObject({ Key: keyname }).promise();

const getSticker = () => {
  return promise.then((data) => {
    console.log(data);
    return data;
  });
};

module.exports.getSticker = getSticker;
