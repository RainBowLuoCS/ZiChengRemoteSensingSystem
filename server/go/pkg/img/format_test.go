package img

import (
	"fmt"
	"testing"
)

func TestStrings2bboxints(t *testing.T) {
	str := "[[0,0,1,1],[204,3,4,5]]"
	out, _ := Strings2bboxints(str)
	fmt.Println(out)
}
