import React from 'react'
import ChartSBMasukAsal from '../charts/ChartSBMasukAsal';
import ChartSBKeluarAsal from '../charts/ChartSBKeluarAsal';
import ChartSRMasukAsal from '../charts/ChartSRMasukAsal';
import ChartSRKeluarAsal from '../charts/ChartSRKeluarAsal';


const LaporanAsal = () => {
  return (
      <div className="mx-auto w-full max-w-4xl">
        <ChartSBMasukAsal />
        <ChartSBKeluarAsal />
        <ChartSRMasukAsal />
        <ChartSRKeluarAsal />
      </div>
  );
};
export default LaporanAsal;
