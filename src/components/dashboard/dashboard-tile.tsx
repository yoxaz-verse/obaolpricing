import { DashboardTileProps } from '@/data/interface-data'
import { Card, CardBody, CardHeader, CircularProgress, Divider } from '@nextui-org/react'
import React from 'react'
import { GrAdd } from 'react-icons/gr'
import DoughnutChart from './Charts/doughnut-chart'
import { doughnutChartData } from '@/data/content-data'
import LineChart from './Charts/line-chart'
import { GrowthTypeChart } from './Charts/growth-type-chart'

const DashboardTile = ({ heading, data, type, stats }: DashboardTileProps) => {
    function DashboardTileData() {
        if (type === 'details') {
            return <>
                <Card className='bg-white shadow-md outline-1 flex items-center justify-center px-6'>
                    <CardHeader className='font-medium text-[#5B5B5B]'>{heading}</CardHeader>
                    <CardBody className='bg-[#CEECFD] text-[#3EADEB] flex items-center justify-center text-3xl w-[100px] rounded-3xl h-[75px] m-5 font-semibold mb-8'>{data}</CardBody>
                </Card>
            </>

        }
        if (type === 'add new') {
            return <>
                <Card className='bg-white shadow-md outline-1 flex items-center justify-center px-6'>

                    <CardHeader className='font-medium text-black'>New Projects</CardHeader>
                    <CardBody className='border-dashed border-1 border-black my-3 w-11/12 h-32 flex justify-center items-center'><button className='w-14 h-14 text-white rounded-full flex items-center justify-center text-2xl bg-[#3EADEB] py-2'><GrAdd /></button>
                        <div className='text-xs my-3'>Tap to create a new project</div>
                    </CardBody>
                </Card>
            </>
        }
        if (type === 'percentage charts') {
            return <>
                <Card className='bg-white shadow-md outline-1 flex items-center justify-center px-6'>

                    <CardHeader className='font-medium text-black'>{heading}</CardHeader>
                    <CardBody className='my-1 w-11/12 flex justify-center items-center'>
                        <CircularProgress
                            classNames={{
                                svg: "w-36 h-36 drop-shadow-md",
                                indicator: "stroke-blue-300",
                                track: "stroke-blue-300/10",
                                value: "text-3xl font-semibold text-blue-300",
                            }}
                            value={70}
                            strokeWidth={4}
                            showValueLabel={true}
                        />
                    </CardBody>
                </Card>
            </>
        }
        if (type === 'line charts') {
            return <>
                <Card className='bg-white shadow-md outline-1 flex items-center justify-center px-6'>

                    <CardHeader className=' text-black flex flex-col'>
                        <div className='text-start w-full font-medium'>{heading}</div>
                        <div className='flex justify-between w-full'>
                            <div className=''>Statistics</div>
                            <div className='text-green-500'>{stats}</div>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className='my-1 w-full flex justify-center items-center'>
                        <LineChart />
                    </CardBody>
                </Card>
            </>
        }
        if (type === 'bar chart') {
            return <>
                <Card className='bg-white shadow-md outline-1 flex items-center justify-center px-6'>

                    <CardHeader className='font-medium text-black'>{heading}</CardHeader>
                    <CardBody className='my-1 w-full flex justify-center items-center'>
                        <GrowthTypeChart />
                    </CardBody>
                </Card>
            </>
        }
    }
    return (
        <>
            {DashboardTileData()}
        </>

    )
}

export default DashboardTile