package util

import "math"

func Decimal(value float64) float64 {
	return math.Trunc(value*1e4+0.5) * 1e-4
}
