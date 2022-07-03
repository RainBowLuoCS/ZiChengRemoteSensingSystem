package img

import (
	"errors"
	"strconv"
)

func Strings2ints(str string) ([][][]int, error) {
	if len(str) == 0 || str[0] != '[' {
		return nil, errors.New("数据为空")
	}
	i := 1
	pics := [][][]int{}
	bracketNum := 1
	for bracketNum > 0 {
		if str[i] == '[' {
			bracketNum++
		} else if str[i] == ']' {
			bracketNum--
		}
		i++
		pic := [][]int{}
		for bracketNum > 1 {
			if str[i] == '[' {
				bracketNum++
			} else if str[i] == ']' {
				bracketNum--
			}
			i++
			line := []int{}
			for bracketNum > 2 {
				if str[i] == ']' {
					bracketNum--
				} else if str[i] >= '0' && str[i] <= '3' {
					num := int(str[i] - '0')
					line = append(line, num)
				}
				i++
			}
			if len(line) > 0 {
				pic = append(pic, line)
			}
		}
		if len(pic) > 0 {
			pics = append(pics, pic)
		}
	}

	return pics, nil
}

func Strings2bboxints(str string) ([][]int, error) {
	if len(str) == 0 || str[0] != '[' {
		return nil, errors.New("数据为空")
	}
	i := 1
	bboxs := [][]int{}
	bracketNum := 1
	for bracketNum > 0 {
		if str[i] == '[' {
			bracketNum++
		} else if str[i] == ']' {
			bracketNum--
		}
		i++
		bbox := []int{}

		for bracketNum > 1 {
			if str[i] == ']' {
				bracketNum--
			} else if str[i] >= '0' && str[i] <= '9' {
				numStr := ""
				for str[i] != ',' && str[i] != ']' {
					numStr += string(str[i])
					i++
				}
				if str[i] == ']' {
					i--
				}
				num, _ := strconv.Atoi(numStr)
				bbox = append(bbox, num)
			}
			i++
		}

		if len(bbox) > 0 {
			bboxs = append(bboxs, bbox)
		}
	}

	return bboxs, nil
}

//func Strings2ints(str string) ([][][][2]int, error) {
//	if len(str) == 0 || str[0] != '[' {
//		return nil, errors.New("数据为空")
//	}
//	i := 1
//	pics := [][][][2]int{}
//	bracketNum := 1
//	for bracketNum > 0 {
//		if str[i] == '[' {
//			bracketNum++
//		} else if str[i] == ']' {
//			bracketNum--
//		}
//		i++
//		pic := [][][2]int{}
//		for bracketNum > 1 {
//			if str[i] == '[' {
//				bracketNum++
//			} else if str[i] == ']' {
//				bracketNum--
//			}
//			i++
//			line := [][2]int{}
//
//			pre := -1
//			count := 0
//			for bracketNum > 2 {
//
//				if str[i] == ']' {
//					if count != 0 {
//						line = append(line, [2]int{count, pre})
//					}
//					bracketNum--
//				} else if str[i] >= '0' && str[i] <= '3' {
//					num := int(str[i] - '0')
//					if num == pre {
//						count++
//					} else {
//						if count != 0 {
//							line = append(line, [2]int{count, pre})
//						}
//						pre = num
//						count = 1
//					}
//					//line = append(line, num)
//				}
//				i++
//			}
//			if len(line) > 0 {
//				pic = append(pic, line)
//			}
//		}
//		if len(pic) > 0 {
//			pics = append(pics, pic)
//		}
//	}
//
//	return pics, nil
//}

//func Strings2ints(str string) ([][][][2]int, error) {
//	if len(str) == 0 || str[0] != '[' {
//		return nil, errors.New("数据为空")
//	}
//	i := 1
//	pics := [][][][2]int{}
//	bracketNum := 1
//	for bracketNum > 0 {
//		if str[i] == '[' {
//			bracketNum++
//		} else if str[i] == ']' {
//			bracketNum--
//		}
//		i++
//		pic := [][][2]int{}
//		for bracketNum > 1 {
//			if str[i] == '[' {
//				bracketNum++
//			} else if str[i] == ']' {
//				bracketNum--
//			}
//			i++
//			line := [][2]int{}
//			for bracketNum > 2 {
//				if str[i] == '[' {
//					bracketNum++
//				} else if str[i] == ']' {
//					bracketNum--
//				}
//				i++
//				compress := [2]int{}
//				for bracketNum > 3 {
//					if str[i] == ']' {
//						bracketNum--
//					} else if str[i] >= '0' && str[i] <= '3' {
//						num := int(str[i] - '0')
//						line = append(line, num)
//					}
//				}
//				if
//			}
//			if len(line) > 0 {
//				pic = append(pic, line)
//			}
//		}
//		if len(pic) > 0 {
//			pics = append(pics, pic)
//		}
//	}
//
//	return pics, nil
//}
