package sql

import (
	"gorm.io/gorm"
	"remoteSensing/database/model"
	"remoteSensing/global"
	"remoteSensing/pkg/util"
	"time"
)

func AddProject(userID uint64, name string) (uint64, error) {
	project := model.Project{
		UserID:    userID,
		Name:      name,
		IsDeleted: false,
		LastVisit: util.Now(),
	}

	err := global.GLOBAL_DB.Create(&project).Error

	return project.ID, err
}

type Project struct {
	ID        uint64    `json:"id"`
	Name      string    `json:"name"`
	LastVisit time.Time `json:"lastVisit"`
}

func GetRecentProjects(userID uint64) ([]Project, error) {
	var projects []Project

	err := global.GLOBAL_DB.Table("projects").
		Select("id", "name", "last_visit").
		Where("user_id = ? AND is_deleted = 0", userID).
		Order("last_visit DESC").
		Scan(&projects).Error

	return projects, err
}

func GetProjectsByKeyword(userID uint64, keyword string) ([]Project, error) {
	var projects []Project

	err := global.GLOBAL_DB.Table("projects").
		Select("id", "name", "last_visit").
		Where("name LIKE ? AND is_deleted = 0 AND user_id = ?", "%"+keyword+"%", userID).
		Order("CHAR_LENGTH(name), last_visit DESC").
		Scan(&projects).Error

	return projects, err
}

func GetRecycleProjects(userID uint64) ([]Project, error) {
	var projects []Project

	err := global.GLOBAL_DB.Table("projects").
		Select("id", "name", "last_visit").
		Where("user_id = ? AND is_deleted = 1", userID).
		Order("last_visit DESC").
		Scan(&projects).Error

	return projects, err
}

func GetRecycleProjectsByKeyword(userID uint64, keyword string) ([]Project, error) {
	var projects []Project

	err := global.GLOBAL_DB.Table("projects").
		Select("id", "name", "last_visit").
		Where("name LIKE ? AND is_deleted = 1 AND user_id = ?", "%"+keyword+"%", userID).
		Order("CHAR_LENGTH(name), last_visit DESC").
		Scan(&projects).Error

	return projects, err
}

func IsExist(projectID, userID uint64) (bool, error) {
	project := new(model.Project)
	flag := false
	err := global.GLOBAL_DB.Transaction(func(tx *gorm.DB) error {
		res := global.GLOBAL_DB.Table("projects").
			Select("is_deleted").
			Where("id = ? AND user_id = ?", projectID, userID).
			Find(project).Limit(1)
		txErr := res.Error
		if txErr != nil {
			return txErr
		}
		flag = res.RowsAffected > 0

		txErr = UpdateLastVisit(tx, projectID)
		if txErr != nil {
			return txErr
		}

		return nil
	})

	return !project.IsDeleted && flag, err
}

func UpdateLastVisit(db *gorm.DB, projectID uint64) error {
	err := db.Table("projects").
		Where("id = ?", projectID).
		Update("last_visit", util.Now()).Error

	return err
}

func SoftDelete(projectID, userID uint64) error {
	err := global.GLOBAL_DB.Table("projects").
		Where("id = ? AND user_id = ?", projectID, userID).
		Update("is_deleted", 1).Error

	return err
}

func Recover(projectID, userID uint64) error {
	err := global.GLOBAL_DB.Table("projects").
		Where("id = ? AND user_id = ?", projectID, userID).
		Updates(map[string]interface{}{
			"is_deleted": 0,
			"last_visit": util.Now(),
		}).Error

	return err
}

func HardDelete(projectID, userID uint64) error {
	err := global.GLOBAL_DB.Where("id = ? AND user_id = ?", projectID, userID).
		Delete(&model.Project{}).Error

	return err
}
