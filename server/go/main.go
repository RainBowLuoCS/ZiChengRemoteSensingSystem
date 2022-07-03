package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"remoteSensing/api/picture/process"
	"remoteSensing/api/project"
	"remoteSensing/api/user"
	"remoteSensing/database"
	"remoteSensing/global"
	"remoteSensing/middleware"
)

// @host 139.196.90.131
// @port 8801
func main() {
	var err error
	global.GLOBAL_DB, err = database.InitDB()
	if err != nil {
		fmt.Println("初始化数据库失败")
		return
	}

	router := gin.Default()
	router.Use(middleware.Cors())
	router.Use(middleware.Logger())

	router.GET("/gs", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"code": 0,
			"msg":  "成功",
			"data": gin.H{},
		})
	})

	apiGroup := router.Group("/api")
	v1Group := apiGroup.Group("/v1")
	userGroup := v1Group.Group("/user")
	{
		userGroup.POST("", user.Register)
		jwtRequiredGroup := userGroup.Group("").Use(middleware.JWTAuth())
		{
			jwtRequiredGroup.GET("", user.GetUserInfo)
			jwtRequiredGroup.PUT("/avatar", user.UploadAvatar)
		}
	}
	sessionGroup := v1Group.Group("/session")
	{
		sessionGroup.POST("", user.Login)
	}
	projectGroup := v1Group.Group("/project").Use(middleware.JWTAuth())
	{
		projectGroup.POST("", project.CreateProject)
		projectGroup.GET("", project.GetRecentPro)
		projectGroup.POST("/:id/delete", project.SoftDeletePro)
		projectGroup.POST("/:id/recover", project.RecoverPro)
		projectGroup.GET("/recycle", project.GetRecyclePro)
		projectGroup.DELETE("/:id", project.HardDeletePro)

		projectGroup.GET("/:id", project.GetPictures)
		projectGroup.POST("/picture", project.UploadPicture)
		projectGroup.DELETE("/picture", project.DeletePics)
		projectGroup.POST("/picture/name", project.UpdatePicName)

		projectGroup.DELETE("/group", project.DeleteGroup)
		projectGroup.POST("/group/name", project.UpdateGroupName)

		projectGroup.POST("/picture/cd", process.ProcessPicCD)
		projectGroup.POST("/picture/gs", process.ProcessPicGS)
		projectGroup.POST("/picture/oa", process.ProcessPicOA)
		projectGroup.POST("/picture/od", process.ProcessPicOD)
		projectGroup.POST("/picture/overall", process.ProcessPicOverall)
	}

	//监听端口默认为8801
	err = router.Run(":8801")
	if err != nil {
		fmt.Println("初始化路由失败，请检查路由端口是否被占用")
	}
}
