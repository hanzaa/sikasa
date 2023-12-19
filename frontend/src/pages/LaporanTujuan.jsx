import React from 'react'
import ChartSBMasukTujuan from '../charts/ChartSBMasukTujuan';
import ChartSBKeluarTujuan from '../charts/ChartSBKeluarTujuan';
import ChartSRMasukTujuan from '../charts/ChartSRMasukTujuan';
import ChartSRKeluarTujuan from '../charts/ChartSRKeluarTujuan';


const LaporanTujuan = () => {
  return (
    <>
    <div className='mx-auto w-full max-w-4xl'>
      <ChartSBMasukTujuan/>
      <ChartSBKeluarTujuan/>
      <ChartSRMasukTujuan/>
      <ChartSRKeluarTujuan/>

    </div>
      
    </>
  )
}

export default LaporanTujuan;
