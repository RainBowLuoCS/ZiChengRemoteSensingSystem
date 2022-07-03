package oss

import (
	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"io"
	"remoteSensing/config"
)

func UploadFile(file io.Reader, fileName string) error {
	// 创建OSSClient实例。
	// yourEndpoint填写Bucket对应的Endpoint，以华东1（杭州）为例，填写为https://oss-cn-hangzhou.aliyuncs.com。其它Region请按实际情况填写。
	// 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
	client, err := oss.New(config.EndPoint, config.AccessKey, config.AccessSecret)
	if err != nil {
		return err
	}

	// 填写存储空间名称，例如examplebucket。
	bucket, err := client.Bucket(config.Bucket)
	if err != nil {
		return err
	}

	// 将文件流上传至exampledir目录下的exampleobject.txt文件。
	err = bucket.PutObject(fileName, file)
	if err != nil {
		return err
	}

	return nil
}
