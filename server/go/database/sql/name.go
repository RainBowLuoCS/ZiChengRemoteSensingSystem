package sql

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"remoteSensing/database/model"
	"strconv"
)

func AddOrUpdatePictureName(db *gorm.DB, name string, projectID uint64) (int, string, error) {
	if len(name) >= 1022 {
		return 0, "", errors.New("名称过长")
	}

	nameInfo := model.Name{}

	res := db.Table("names").
		Select("count").
		Where("project_id = ? AND name = ?", projectID, name).
		First(&nameInfo)

	if res.RowsAffected == 0 {
		fmt.Println(res.RowsAffected)
		fmt.Println(nameInfo.Count)

		nameInfo = model.Name{
			ProjectID: projectID,
			Name:      name,
			Count:     1,
		}

		err := db.Create(&nameInfo).Error

		return 0, name, err
	} else {
		count := nameInfo.Count + 1
		countStr := strconv.Itoa(count)
		newName := name + "-" + countStr
		tempCount, _, err := AddOrUpdatePictureName(db, newName, projectID)
		if err != nil {
			return 0, "", err
		}
		for tempCount != 0 {
			count++
			countStr := strconv.Itoa(count)
			newName := name + "-" + countStr
			tempCount, _, err = AddOrUpdatePictureName(db, newName, projectID)
			if err != nil {
				return 0, "", err
			}
		}
		err = db.Model(&model.Name{}).
			Where("project_id = ? AND name = ?", projectID, name).
			Update("count", count).Error
		if err != nil {
			return 0, "", err
		}

		return count, newName, err
	}
}
