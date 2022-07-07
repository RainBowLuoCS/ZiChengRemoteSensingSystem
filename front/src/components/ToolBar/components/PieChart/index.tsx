import { observer } from 'mobx-react-lite'
import { PieChart, Pie, Cell } from 'recharts'
import { resultColors } from '../../../../consts/color'
import { ProjectStore } from '../../../../mobx/project'

type Props = {
  detectType: 1 | 2 | 3 | 4 | 5
  // 面积占比/图块数量
  displayType: 1 | 2
}

function _MyPieChart(props: Props) {
  const { detectType, displayType } = props

  const data =
    displayType === 1
      ? ProjectStore.currentShownGroup.info.colors.map((item, index) => {
          return {
            name: '',
            value: item
          }
        })
      : ProjectStore.currentShownGroup.info.nums.map((item, index) => {
          return {
            name: '',
            value: item
          }
        })

  return (
    <PieChart width={110} height={110}>
      <Pie
        data={data}
        cx={50}
        cy={50}
        innerRadius={38}
        outerRadius={50}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={resultColors[index % resultColors.length]}
          />
        ))}
      </Pie>
    </PieChart>
  )
}

const MyPieChart = observer(_MyPieChart)

export default MyPieChart
