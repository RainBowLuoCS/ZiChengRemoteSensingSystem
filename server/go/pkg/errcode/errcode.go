package errcode

import (
	"fmt"
)

// 系统相关
var (
	Success     = NewError(0, "成功")
	ServerError = NewError(1000, "服务内部错误")
	ParamError  = NewError(1001, "传入参数错误")
)

// 用户及鉴权相关
var (
	UnauthorizedTokenNull    = NewError(2000, "认证信息有误")  //鉴权失败，token 为空
	UnauthorizedTokenError   = NewError(2001, "认证信息有误")  //鉴权失败，token 错误
	UnauthorizedUserNotFound = NewError(2002, "认证信息有误")  //鉴权失败，用户不存在
	PasswordNull             = NewError(2003, "密码不能为空")  //传入密码为空
	AccountExist             = NewError(2004, "帐号已存在")   //账号已存在
	AccountNotFound          = NewError(2005, "帐号或密码错误") //用户不存在
	PasswordError            = NewError(2006, "帐号或密码错误") //密码错误
	UploadAvatarError        = NewError(2007, "上传头像失败")  //上传头像失败
)

// 项目相关
var (
	AccountProjectError = NewError(3000, "服务器内部错误")       //用户和项目不匹配
	UploadFileError     = NewError(3001, "服务器内部错误")       //上传图片发生错误
	GetFolderError      = NewError(3002, "服务器内部错误")       //获取文件目录发生错误
	DeleteFileError     = NewError(3003, "服务器内部错误")       //删除文件发生错误
	GroupExist          = NewError(3004, "该图片的综合分析分组已存在") //该图片的综合分析分组已存在
	Rename              = NewError(3005, "图片名称重复，已重命名")   //该图片指定名称重复，已自动重命名
	PictureNotProcess   = NewError(3006, "该图片未做任何分析处理")   //该图片未做任何分析处理
	OverallGroupExist   = NewError(3007, "该图片已存在综合分析分组")
)

type ErrorInfo struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

func NewError(code int, msg string) *ErrorInfo {
	return &ErrorInfo{Code: code, Msg: msg}
}

func (e *ErrorInfo) Errorf() string {
	return fmt.Sprintf("错误码：%d, 错误信息:：%s", e.Code, e.Msg)
}
