package predict

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"remoteSensing/pkg/img"
)

func GetODLabelMapInfo(imgNames, t string) ([][]int, error) {
	url := fmt.Sprintf("http://127.0.0.1:8808/od/%s?ps=%s", t, imgNames)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	bboxBytes, err := ioutil.ReadAll(resp.Body)
	bboxStr := string(bboxBytes)

	bboxs, err := img.Strings2bboxints(bboxStr)
	return bboxs, err
}
