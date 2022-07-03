package predict

import (
	"io/ioutil"
	"net/http"
	"remoteSensing/pkg/img"
)

func GetOALabelMapInfo(imgNames string) ([][]int, error) {
	url := "http://127.0.0.1:8808/oa?ps=" + imgNames
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	labelMapBytes, err := ioutil.ReadAll(resp.Body)
	labelMapStr := string(labelMapBytes)

	pics, err := img.Strings2ints(labelMapStr)
	return pics[0], err
}
