package img

import (
	"fmt"
	"testing"
)

func TestGetColorNums(t *testing.T) {
	data := [][]int{
		{0, 0, 1, 0, 1, 0, 2, 0},
		{0, 0, 1, 1, 1, 0, 2, 0},
	}

	fmt.Println(GetColorNums(data))
}

func TestGetHouseNum(t *testing.T) {
	data := [][]int{
		{0, 0, 0, 0, 0, 1, 0, 0, 0},
		{0, 0, 0, 0, 0, 1, 1, 1, 0},
		{0, 1, 0, 1, 0, 1, 0, 0, 0},
		{0, 1, 0, 1, 0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0, 0, 0, 0, 1},
		{0, 0, 0, 0, 0, 1, 0, 1, 0},
	}

	fmt.Println(GetHouseNum(data))
}