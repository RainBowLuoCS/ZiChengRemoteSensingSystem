package project

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"remoteSensing/api/response/common"
	"remoteSensing/config"
	"remoteSensing/database/sql"
	"remoteSensing/pkg/errcode"
	"remoteSensing/pkg/util"
)

type RecycleKeyword struct {
	Keyword string `form:"keyword"`
}

type RecycleInfo struct {
	ID        uint64 `json:"id"`
	Name      string `json:"name"`
	LastVisit string `json:"lastVisit"`
	CoverURL  string `json:"coverURL"`
}

type RecycleProData struct {
	Projects []RecycleInfo `json:"projects"`
}

func GetRecyclePro(c *gin.Context) {
	acc, _ := c.Get("account")
	account := acc.(string)

	k := new(RecycleKeyword)
	err := c.ShouldBind(k)
	if err != nil {
		common.Respond(c, errcode.ParamError, gin.H{})
		return
	}

	u, err := sql.GetUserByUsername(account)
	if err != nil {
		common.Respond(c, errcode.UnauthorizedUserNotFound, gin.H{})
		return
	}

	keyword := k.Keyword
	var pros []sql.Project
	if keyword == "" {
		// 获取所有项目
		pros, err = sql.GetRecycleProjects(u.ID)
	} else {
		// 根据关键字查询项目
		pros, err = sql.GetRecycleProjectsByKeyword(u.ID, keyword)
	}
	if err != nil {
		common.Respond(c, errcode.ServerError, gin.H{})
		return
	}

	infos := make([]RecycleInfo, len(pros))
	for i := 0; i < len(pros); i++ {
		coverURL := fmt.Sprintf("%s%d/%d/cover.png", config.ProjectPath, u.ID, pros[i].ID)
		infos[i] = RecycleInfo{
			ID:        pros[i].ID,
			Name:      pros[i].Name,
			LastVisit: util.Time2DateStr(pros[i].LastVisit),
			CoverURL:  coverURL,
		}
	}

	data := RecycleProData{Projects: infos}
	common.Respond(c, errcode.Success, data)
}
