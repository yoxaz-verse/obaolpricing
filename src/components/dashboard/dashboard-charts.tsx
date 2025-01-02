import React from 'react'
import { MultiTypeChart } from './Charts/multitype-chart'
import { GrowthTypeChart } from './Charts/growth-type-chart'
import { Card } from '@nextui-org/react'

const DashboardCharts = () => {
  return (
    <div className='w-full'>
      <div>
        <div className='text-xl font-semibold py-3'>Heading</div>
        <div className='py-5'>
          <Card className='p-2'><GrowthTypeChart /></Card>
        </div>
        <div className='text-xl font-semibold py-3'>Heading</div>

        <div >
          <Card className='p-2'><MultiTypeChart /></Card></div>
      </div>

    </div>
  )
}

export default DashboardCharts