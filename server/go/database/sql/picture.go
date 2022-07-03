package sql

import (
	"errors"
	"gorm.io/gorm"
	"math"
	"remoteSensing/database/model"
	"remoteSensing/global"
)

func AddPicture(db *gorm.DB, uuid, name string, projectID, groupID uint64, t int8) (bool, error) {
	if name == "" {
		name = "未命名"
	}

	flag := false

	err := db.Transaction(func(tx *gorm.DB) error {
		newName := name
		count := 0
		var txErr error
		if groupID == math.MaxUint64 {
			count, newName, txErr = AddOrUpdatePictureName(tx, name, projectID)
			if txErr != nil {
				return txErr
			}
			if count != 0 {
				flag = true
			}
		}

		picture := model.Picture{
			UUID:      uuid,
			ProjectID: projectID,
			GroupID:   groupID,
			Name:      newName,
			Type:      t,
		}

		txErr = db.Create(&picture).Error
		if txErr != nil {
			return txErr
		}

		return nil
	})

	return flag, err
}

type Picture struct {
	UUID string `json:"uuid"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PicInfo struct {
	UUID      string
	Name      string
	ProjectID uint64
	GroupID   uint64
	Type      int8
}

func GetGroupPictures(projectID uint64) ([]PicInfo, error) {
	var defaultGroupID uint64 = 1<<64 - 1
	var infos []PicInfo

	err := global.GLOBAL_DB.Table("pictures").
		Select("uuid", "name", "group_id", "type").
		Where("project_id = ? AND group_id <> ?", projectID, defaultGroupID).
		Order("type").
		Find(&infos).Error

	return infos, err
}

func GetRestPictures(projectID uint64) ([]PicInfo, error) {
	var defaultGroupID uint64 = 1<<64 - 1
	var infos []PicInfo

	err := global.GLOBAL_DB.Table("pictures").
		Select("uuid", "name", "group_id", "type").
		Where("project_id = ? AND group_id = ?", projectID, defaultGroupID).
		Order("convert(name using gbk) collate gbk_chinese_ci").
		Find(&infos).Error

	return infos, err
}

type PicNum struct {
	Count int
}

func GetOverallPicturesNum(groupID uint64) (int, error) {
	var picNum PicNum

	err := global.GLOBAL_DB.Table("pictures").
		Select("COUNT(*) AS count").
		Where("group_id = ?", groupID).
		Scan(&picNum).Error

	return picNum.Count, err
}

func UpdatePictureGroupIDandType(db *gorm.DB, uuid string, groupID uint64, t int8) error {
	pic := new(PicInfo)
	err := db.Table("pictures").
		Select("group_id", "name", "project_id").
		Where("uuid = ?", uuid).
		First(pic).Error
	if err != nil {
		return err
	}

	//if pic.GroupID == math.MaxUint64 {
	//	err = db.Table("pictures").
	//		Select("group_id", "type").
	//		Where("uuid = ?", uuid).
	//		Updates(map[string]interface{}{
	//			"group_id": groupID,
	//			"type":     t,
	//		}).Error
	//	if err != nil {
	//		return err
	//	}
	//} else {
	_, err = AddPicture(db, uuid, pic.Name, pic.ProjectID, groupID, t)
	if err != nil {
		return err
	}
	//}

	return nil
}

func DeletePicture(db *gorm.DB, uuids []string) error {
	var defaultGroupID uint64 = 1<<64 - 1
	err := db.Table("pictures").
		Where("uuid IN ? AND group_id = ?", uuids, defaultGroupID).
		Delete(&model.Picture{}).Error

	return err
}

func DeleteGroupPicture(db *gorm.DB, groupID uint64) error {
	err := db.Table("pictures").
		Where("group_id = ?", groupID).
		Delete(model.Picture{}).Error

	return err
}

func UpdateDeleteGroupID(db *gorm.DB, uuid string) error {
	pic := new(model.Picture)
	res := db.Table("pictures").
		Where("uuid = ?", uuid).
		First(pic)

	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("删除组失败")
	} else if res.RowsAffected == 1 {
		var defaultGroupID uint64 = 1<<64 - 1
		err := db.Model(pic).
			Updates(map[string]interface{}{
				"group_id": defaultGroupID,
				"type":     0,
			}).Error
		return err
	} else {
		err := db.Delete(pic).Error
		return err
	}
}

type PicNameLikeCount struct {
	Count int
}

func UpdatePictureName(db *gorm.DB, uuid string, name string, projectID uint64) (bool, error) {
	if name == "" {
		name = "未命名"
	}

	flag := false

	err := db.Transaction(func(tx *gorm.DB) error {
		count, newName, txErr := AddOrUpdatePictureName(tx, name, projectID)
		if txErr != nil {
			return txErr
		}
		if count != 0 {
			flag = true
		}

		txErr = db.Model(&model.Picture{}).
			Where("uuid = ? AND project_id = ?", uuid, projectID).
			Update("name", newName).Error
		if txErr != nil {
			return txErr
		}

		return nil
	})

	return flag, err
}

func GetPicturesByGroupID(groupID uint64) ([]PicInfo, error) {
	var pics []PicInfo
	err := global.GLOBAL_DB.Table("pictures").
		Select("uuid", "name", "type").
		Where("group_id = ?", groupID).
		Order("type").
		Find(&pics).Error

	return pics, err
}

func GetPictureInfo(db *gorm.DB, uuid string) (PicInfo, error) {
	var pic PicInfo
	err := db.Table("pictures").
		Select("name").
		Where("uuid = ?", uuid).
		First(&pic).Error

	return pic, err
}
