package util

import "time"

// Time2DateStr date time.Time to string
func Time2DateStr(time time.Time) string {
	return time.Format("2006-01-02 15:04:05")
}

// Now 获取东八区当前时间
func Now() time.Time {
	return time.Now().Add(time.Hour * 8)
}
