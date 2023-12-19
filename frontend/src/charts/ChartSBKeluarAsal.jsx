import React, { useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";
import { useQuery } from "@tanstack/react-query";
import Datepicker from "../components/Datepicker";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const ChartSBKeluarAsal = () => {
   // [start] settiung up react-query --------------------
   const [selectedDates, setSelectedDates] = useState([]);
   const [dateFilters, setDateFilters] = useState([
      {
         id: "tgl_surat",
         value: [],
      },
   ]);
   const [globalFilter, setGlobalFilter] = useState("");
   const [sorting, setSorting] = useState([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 999999,
   });
   // Define a function to handle changes in selected dates
   const handleDateChange = (dates) => {
      setSelectedDates(dates);
      setDateFilters((prevDateFilters) => {
         prevDateFilters[0].value = dates;
         return prevDateFilters;
      });
   };

   const {
      data: dataSBKeluar,
      isError,
      isFetching,
      isLoading,
      refetch,
   } = useQuery({
      queryKey: [
         "dataSBKeluar-data",
         dateFilters, //refetch when dateFilters changes
         globalFilter, //refetch when globalFilter changes
         pagination.pageIndex, //refetch when pagination.pageIndex changes
         pagination.pageSize, //refetch when pagination.pageSize changes
         sorting, //refetch when sorting changes
      ],
      queryFn: async () => {
         const apiUrl = `${
            import.meta.env.VITE_SERVER_LINK
         }/data/agendaSBKeluar`;
         try {
            const response = await axios.get(apiUrl, {
               params: {
                  start: pagination.pageIndex,
                  size: pagination.pageSize,
                  filters: JSON.stringify(dateFilters ?? []),
                  globalFilter: globalFilter ?? "",
                  sorting: JSON.stringify(sorting ?? []),
               },
            });

            return response.data;
         } catch (error) {
            throw error;
         }
      },
      keepPreviousData: true,
   });
   // [finish] query data from server --------------------

   const generateDataForChart = (data) => {
      const dariCount = {};

      data.forEach((item) => {
         const dari = item["dari"];
         if (dariCount[dari]) {
            dariCount[dari]++;
         } else {
            dariCount[dari] = 1;
         }
      });

      const dariLabels = Object.keys(dariCount);
      const suratCount = Object.values(dariCount);

      return {
         labels: dariLabels,
         datasets: [
            {
               label: "Jumlah Surat",
               data: suratCount,
               backgroundColor: "rgba(75, 192, 192, 0.2)", // Atur warna latar belakang
               borderColor: "rgba(75, 192, 192, 1)", // Atur warna batas
               borderWidth: 2, // Atur lebar garis batas
            },
         ],
      };
   };

   const chartData = generateDataForChart(dataSBKeluar?.data ?? []);
   const totalSuratCount = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

   return (
      <>
         <div className="flex flex-row gap-6 justify-center items-center ">
            <div className="basis-10/12 flex flex-col col-span-full bg-white my-4 shadow-lg rounded-sm border border-slate-200">
               <header className="px-5 py-4 border-b text-lg border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                     Surat Biasa Keluar
                  </h2>
                  <div className="flex items-center">
                     <Datepicker onChange={handleDateChange} />
                  </div>
               </header>
               <BarChart
                  chartData={chartData}
                  options={{
                     scales: {
                        y: {
                           beginAtZero: true,
                           title: {
                              display: true,
                              text: "Jumlah Surat",
                           },
                        },
                        x: {
                           title: {
                              display: true,
                              text: "Asal",
                           },
                        },
                     },
                  }}
               />
            </div>
         </div>

         <div className="flex flex-row gap-6  justify-center items-center mb-28">
            <div className="basis-10/12 my-4 flex flex-col gap-10 justify-center">
               <Card>
                  <CardContent className="text-center">
                     <h1 className="text-3xl font-bold text-gray-800">{totalSuratCount}</h1>
                     <p className="text-lg text-gray-600">Total Surat</p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </>
   );
};

export default ChartSBKeluarAsal;
