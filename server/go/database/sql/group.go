package sql

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"math"
	"remoteSensing/database/model"
	"remoteSensing/global"
	"remoteSensing/pkg/util"
)

func AddGroup(db *gorm.DB, projectID uint64, name string, t int8, info datatypes.JSON) (uint64, error) {
	group := model.Group{
		ProjectID: projectID,
		Name:      name,
		CreatedAt: util.Now(),
		Type:      t,
		Info:      info,
	}

	err := db.Create(&group).Error

	return group.ID, err
}

type Group struct {
	ID       uint64         `json:"groupID"`
	Name     string         `json:"groupName"`
	Type     int8           `json:"groupType"`
	Info     datatypes.JSON `json:"info"`
	Pictures []Picture      `json:"pictures"`
}

type GroupInfo struct {
	ID   uint64
	Name string
	Type int8
	Info datatypes.JSON
}

func GetGroups(projectID uint64) ([]GroupInfo, error) {
	var groups []GroupInfo

	err := global.GLOBAL_DB.Table("groups").
		Select("id", "name", "type", "info").
		Where("project_id = ?", projectID).
		Order("`type`, convert(name using gbk) collate gbk_chinese_ci, created_at DESC").
		Find(&groups).Error

	return groups, err
}

func GetOverallGroups(uuid string) ([]GroupInfo, error) {
	var groups []GroupInfo

	err := global.GLOBAL_DB.Table("groups").
		Select("groups.id", "groups.type", "groups.info").
		Joins("LEFT JOIN pictures ON groups.id = pictures.group_id").
		Where("pictures.uuid = ? AND groups.type <> 1", uuid).
		Order("groups.type, groups.id").
		Find(&groups).Error

	return groups, err
}

func UpdateGroupName(db *gorm.DB, projectID, groupID uint64, name string) error {
	err := db.Model(&model.Group{}).
		Where("id = ? AND project_id = ?", groupID, projectID).
		Update("name", name).Error

	return err
}

func UpdateGroupInfo(db *gorm.DB, projectID, groupID uint64, info datatypes.JSON) error {
	err := db.Model(&model.Group{}).
		Where("id = ? AND project_id = ?", groupID, projectID).
		Update("info", info).Error

	return err
}

func DeleteGroup(db *gorm.DB, groupID uint64) error {
	err := db.Table("groups").
		Where("id = ?", groupID).
		Delete(&model.Group{}).Error

	return err
}

func PicGroupTypeIsExist(uuid string, t int, projectID uint64) (GroupInfo, bool, error) {
	var group GroupInfo

	res := global.GLOBAL_DB.Table("groups").
		Select("groups.id", "groups.info").
		Joins("LEFT JOIN pictures ON groups.id = pictures.group_id").
		Where("pictures.uuid = ? AND groups.type = ? AND groups.project_id = ?", uuid, t, projectID).
		First(&group)

	return group, res.RowsAffected != 0, res.Error
}

func PicOverallGroupIsExist(uuid string, projectID uint64) (GroupInfo, bool, error) {
	var group GroupInfo

	res := global.GLOBAL_DB.Table("groups").
		Select("groups.id", "groups.info").
		Joins("LEFT JOIN pictures ON groups.id = pictures.group_id").
		Where("pictures.uuid = ? AND groups.type = 1 AND groups.project_id = ? AND pictures.type = ?", uuid, projectID, math.MaxInt8).
		First(&group)

	return group, res.RowsAffected != 0, res.Error
}

//func CDPicGroupTypeIsExist(uuids []string, t int) (GroupInfo, bool, error) {
//	var groups1 GroupInfo
//	var groups2 GroupInfo
//
//	res1 := global.GLOBAL_DB.Table("groups").
//		Select("id", "groups.info").
//		Joins("LEFT JOIN pictures ON groups.id = pictures.group_id").
//		Where("pictures.uuid = ? AND groups.type = ?", uuids[0], t).
//		First(&groups1)
//
//	res2 := global.GLOBAL_DB.Table("groups").
//		Select("id", "groups.info").
//		Joins("LEFT JOIN pictures ON groups.id = pictures.group_id").
//		Where("pictures.uuid = ? AND groups.type = ?", uuids[1], t).
//		First(&groups2)
//
//	if res1.Error != nil {
//		return GroupInfo{}, false, res1.Error
//	}
//	if res2.Error != nil {
//		return GroupInfo{}, false, res2.Error
//	}
//
//	return group, res1.RowsAffected == 1, nil
//}
