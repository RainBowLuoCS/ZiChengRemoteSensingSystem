package img

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io/ioutil"
	"os"
	"remoteSensing/pkg/util"
	"strings"
)

// OutPic 将 int8 流输出为图片
func OutPic(data [][]int, out string) []float64 {
	Color1 := color.RGBA{R: 92, G: 193, B: 177, A: 1}
	Color2 := color.RGBA{R: 252, G: 203, B: 186, A: 1}
	Color3 := color.RGBA{R: 101, G: 94, B: 141, A: 1}
	Color4 := color.RGBA{R: 254, G: 99, B: 94, A: 1}
	Color5 := color.RGBA{R: 200, G: 201, B: 215, A: 1}

	var sum1, sum2, sum3, sum4, sum5 float64

	bounds := image.Rectangle{
		Min: image.Point{0, 0},
		Max: image.Point{len(data[0]), len(data)},
	}
	outPic := image.NewRGBA(bounds) //new 一个新的图片
	dx := bounds.Dx()
	dy := bounds.Dy()

	for i := 0; i < dy; i++ {
		for j := 0; j < dx; j++ {
			if data[i][j] == 0 {
				outPic.SetRGBA(j, i, Color1)
				sum1++
			} else if data[i][j] == 1 {
				outPic.SetRGBA(j, i, Color2)
				sum2++
			} else if data[i][j] == 2 {
				outPic.SetRGBA(j, i, Color3)
				sum3++
			} else if data[i][j] == 3 {
				outPic.SetRGBA(j, i, Color4)
				sum4++
			} else if data[i][j] == 4 {
				outPic.SetRGBA(j, i, Color5)
				sum5++
			}
		}
	}

	var percents []float64
	if sum3 == 0 && sum4 == 0 && sum5 == 0 {
		num1 := util.Decimal(sum1 / float64(dx*dy))
		num2 := util.Decimal(1 - num1)
		percents = []float64{num1, num2}
	} else {
		num2 := util.Decimal(sum2 / float64(dx*dy))
		num3 := util.Decimal(sum3 / float64(dx*dy))
		num4 := util.Decimal(sum4 / float64(dx*dy))
		num5 := util.Decimal(sum5 / float64(dx*dy))
		num1 := util.Decimal(1 - num2 - num3 - num4 - num5)
		percents = []float64{num1, num2, num3, num4, num5}
	}

	f, _ := os.Create(out)
	defer f.Close()
	encode(out, f, outPic)

	return percents
}

func ODOutPic(bboxs [][]int, originPath, targetPath string) (int, int) {
	originFile, _ := ioutil.ReadFile(originPath) //读取文件
	originBytes := bytes.NewBuffer(originFile)
	originImg, _, _ := image.Decode(originBytes)
	bounds := originImg.Bounds()
	dx := bounds.Dx()
	dy := bounds.Dy()

	template := make([][]bool, dy)
	for i := 0; i < dy; i++ {
		template[i] = make([]bool, dx)
	}
	for k := 0; k < len(bboxs); k++ {
		x := bboxs[k][0]
		y := bboxs[k][1]
		w := bboxs[k][2]
		h := bboxs[k][3]
		for i := y; i < y+h; i++ {
			for j := x; j < x+w; j++ {
				template[i][j] = true
			}
		}
	}

	newRgba := image.NewRGBA(bounds) //new 一个新的图片
	for i := 0; i < dy; i++ {
		for j := 0; j < dx; j++ {
			colorRgb := originImg.At(j, i)
			r, g, b, a := colorRgb.RGBA()

			var percentage uint16 = 0
			if template[i][j] {
				percentage = 1
			}
			opacity := uint16(a * uint32(percentage))
			v := newRgba.ColorModel().Convert(color.NRGBA64{R: uint16(r), G: uint16(g), B: uint16(b), A: opacity})
			rr, gg, bb, aa := v.RGBA()
			newRgba.SetRGBA(j, i, color.RGBA{R: uint8(rr), G: uint8(gg), B: uint8(bb), A: uint8(aa)})
		}
	}

	f, _ := os.Create(targetPath)
	defer f.Close()
	encode(originPath, f, newRgba)

	return dx, dy
}

//图片编码 写入
func encode(inputName string, file *os.File, rgba *image.RGBA) {
	if strings.HasSuffix(inputName, "jpg") || strings.HasSuffix(inputName, "jpeg") {
		jpeg.Encode(file, rgba, nil)
		//png.Encode(file, rgba)
	} else if strings.HasSuffix(inputName, "png") {
		png.Encode(file, rgba)
	} else if strings.HasSuffix(inputName, "gif") {
		gif.Encode(file, rgba, nil)
	} else {
		fmt.Errorf("不支持的图片格式")

	}
}

func GetColorNums(data [][]int) []int {
	if len(data) == 0 || len(data[0]) == 0 {
		return nil
	}

	lx := len(data)
	ly := len(data[0])

	nums := make([]int, 5)

	var bfs func(int, int, int)
	bfs = func(bi, bj, current int) {
		nums[current]++
		data[bi][bj] = -1

		queue := [][2]int{[2]int{bi, bj}}
		for len(queue) > 0 {
			top := queue[0]
			i := top[0]
			j := top[1]
			queue = queue[1:]

			if i+1 < lx && data[i+1][j] == current {
				queue = append(queue, [2]int{i + 1, j})
				data[i+1][j] = -1
			}
			if j+1 < ly && data[i][j+1] == current {
				queue = append(queue, [2]int{i, j + 1})
				data[i][j+1] = -1
			}
			if i > 0 && data[i-1][j] == current {
				queue = append(queue, [2]int{i - 1, j})
				data[i-1][j] = -1
			}
			if j > 0 && data[i][j-1] == current {
				queue = append(queue, [2]int{i, j - 1})
				data[i][j-1] = -1
			}
		}
	}

	for i := 0; i < lx; i++ {
		for j := 0; j < ly; j++ {
			if data[i][j] == -1 {
				continue
			} else {
				bfs(i, j, data[i][j])
			}
		}
	}

	return nums
}

func GetHouseNum(data [][]int) int {
	if len(data) == 0 || len(data[0]) == 0 {
		return -1
	}

	lx := len(data)
	ly := len(data[0])

	num := 0

	var bfs func(int, int)
	bfs = func(bi, bj int) {
		num++
		data[bi][bj] = -1

		queue := [][2]int{[2]int{bi, bj}}
		for len(queue) > 0 {
			top := queue[0]
			i := top[0]
			j := top[1]
			queue = queue[1:]

			if i+1 < lx && data[i+1][j] == 1 {
				queue = append(queue, [2]int{i + 1, j})
				data[i+1][j] = -1
			}
			if j+1 < ly && data[i][j+1] == 1 {
				queue = append(queue, [2]int{i, j + 1})
				data[i][j+1] = -1
			}
			if i > 0 && data[i-1][j] == 1 {
				queue = append(queue, [2]int{i - 1, j})
				data[i-1][j] = -1
			}
			if j > 0 && data[i][j-1] == 1 {
				queue = append(queue, [2]int{i, j - 1})
				data[i][j-1] = -1
			}
		}
	}

	for i := 0; i < lx; i++ {
		for j := 0; j < ly; j++ {
			if data[i][j] == -1 || data[i][j] == 0 {
				continue
			} else {
				bfs(i, j)
			}
		}
	}

	return num
}
