package oss

import (
	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"remoteSensing/config"
)

func GetAllNames(folderName string) ([]string, error) {
	// 创建OSSClient实例。
	// yourEndpoint填写Bucket对应的Endpoint，以华东1（杭州）为例，填写为https://oss-cn-hangzhou.aliyuncs.com。其它Region请按实际情况填写。
	// 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
	client, err := oss.New(config.EndPoint, config.AccessKey, config.AccessSecret)
	if err != nil {
		return nil, err
	}

	// 填写存储空间名称。
	bucket, err := client.Bucket(config.Bucket)
	if err != nil {
		return nil, err
	}

	names := []string{}

	// 遍历文件。
	marker := oss.Marker("")
	prefix := oss.Prefix(folderName)
	for {
		lor, err := bucket.ListObjects(marker, prefix)
		if err != nil {
			return nil, err
		}
		for _, object := range lor.Objects {
			names = append(names, object.Key)
		}
		if lor.IsTruncated {
			prefix = oss.Prefix(lor.Prefix)
			marker = oss.Marker(lor.NextMarker)
		} else {
			break
		}
	}

	return names, nil
}
