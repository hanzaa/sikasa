import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
   MaterialReactTable,
   useMaterialReactTable,
} from "material-react-table";
import { useQuery, useMutation } from "@tanstack/react-query";

import axios from "axios";

// Material-UI Icons Imports
import RefreshIcon from "@mui/icons-material/Refresh";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Material-UI Core Components Imports
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   IconButton,
   Input,
   MenuItem,
   Stack,
   TextField,
   Tooltip,
} from "@mui/material";

// CSV Export and Related Imports
import { CSVLink } from "react-csv";

import { toast } from "react-toastify";

import {
   useAlamatSuratEksternal,
   useAlamatSuratInternal,
   useDerajat,
   useSarkom,
   useSistem,
   usePetugas,
} from "../data/DataMaster";

const SBKeluar = () => {
   // [start] taking data for dropdown select----------------------------------------------------------------------------
   const alamatSuratEksternalQuery = useAlamatSuratEksternal();
   const alamatSuratInternalQuery = useAlamatSuratInternal();
   const derajatQuery = useDerajat();
   const sarkomQuery = useSarkom();
   const sistemQuery = useSistem();
   const petugasQuery = usePetugas();

   const Kepada = alamatSuratEksternalQuery.data;
   const Dari = alamatSuratInternalQuery.data;
   const Derajat = derajatQuery.data;
   const Sarkom = sarkomQuery.data;
   const Sistem = sistemQuery.data;
   const Petugas = petugasQuery.data;
   // [finish] taking data for dropdown select---------------------------------------------------------------------------

   // [start] configure validation errors--------------------------------------------------------------------------------
   const [validationErrors, setValidationErrors] = useState({});
   const validateRequired = (value) => !!value.length;

   const getCommonEditTextFieldProps = useCallback(
      (cell) => {
         return {
            error: !!validationErrors[cell.id],
            helperText: validationErrors[cell.id],
            required: true,
            onBlur: (event) => {
               const isValid = validateRequired(event.target.value);
               if (!isValid) {
                  //set validation error for cell if invalid
                  setValidationErrors({
                     ...validationErrors,
                     [cell.id]: `${cell.column.columnDef.header} is required`,
                  });
               } else {
                  //remove validation error for cell if valid
                  delete validationErrors[cell.id];
                  setValidationErrors({
                     ...validationErrors,
                  });
               }
            },
         };
      },
      [validationErrors]
   );
   // [finish] configure validation errors--------------------------------------------------------------------------------

   // [start] column definitions--------------------------------------------------------------------------------
   const columns = useMemo(
      () => [
         {
            accessorKey: "no_agenda",
            header: "No Agenda",
            enableEditing: false, // disable editing on this column
            size: 1,
         
         },
         {
            accessorKey: "no_surat",
            header: "No Surat",
            size: 20,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
            }),
         },
         {
            accessorKey: "tgl_surat",
            header: "Tanggal Surat",
            size: 20,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "date",
            }),
            filterVariant: "range",
            filterFn: "betweenInclusive",
            Filter: (params) => {
               const { column, rangeFilterIndex } = params;
               const filterValue = column.getFilterValue() ?? [0, 0];
               return (
                  <Input
                     type="date"
                     onChange={(e) => {
                        params.header.column.setFilterValue(
                           filterValue.map((filter, ind) =>
                              ind === rangeFilterIndex ? e.target.value : filter
                           )
                        );
                     }}
                     value={filterValue[rangeFilterIndex] ?? ""}
                  />
               );
            },
         },
         {
            accessorKey: "dari",
            header: "Dari",
            size: 50,
            editVariant: "select",
            editSelectOptions: Dari ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "kepada",
            header: "Kepada",
            size: 50,
            editVariant: "select",
            editSelectOptions: Kepada ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "tembusan",
            header: "Tembusan",
            size: 200,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
            }),
         },
         {
            accessorKey: "jumlah_copy",
            header: "Jumlah Copy",
            size: 50,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "number",
            }),
         },
         {
            accessorKey: "derajat",
            header: "Derajat",
            size: 100,
            editVariant: "select",
            editSelectOptions: Derajat ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "sarkom",
            header: "Sarkom",
            size: 150,
            editVariant: "select",
            editSelectOptions: Sarkom ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "jml_hal",
            header: "Jumlah Halaman",
            size: 50,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "number",
            }),
         },
         {
            accessorKey: "isi_berita",
            header: "Isi Berita",
            size: 150,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               multiline: true,
               maxRows: 4,
            }),
            muiTableHeadCellProps: {
               align: "center",
            },
         },
         {
            accessorKey: "tgl_surat_diterima",
            header: "Tanggal Surat Diterima",
            size: 220,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "date",
            }),
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            filterVariant: "range",
            filterFn: "betweenInclusive",
            Filter: (params) => {
               const { column, rangeFilterIndex } = params;
               const filterValue = column.getFilterValue() ?? [0, 0];
               return (
                  <Input
                     type="date"
                     onChange={(e) => {
                        params.header.column.setFilterValue(
                           filterValue.map((filter, ind) =>
                              ind === rangeFilterIndex ? e.target.value : filter
                           )
                        );
                     }}
                     value={filterValue[rangeFilterIndex] ?? ""}
                  />
               );
            },
         },
         {
            accessorKey: "jam_terima",
            header: "Jam Surat Diterima",
            size: 150,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "time",
            }),
         },
         {
            accessorKey: "tgl_surat_dikirim",
            header: "Tanggal Surat Dikirim",
            size: 220,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "date",
            }),
            filterVariant: "range",
            filterFn: "betweenInclusive",
            Filter: (params) => {
               const { column, rangeFilterIndex } = params;
               const filterValue = column.getFilterValue() ?? [
                  undefined,
                  undefined,
               ];
               return (
                  <Input
                     type="date"
                     onChange={(e) => {
                        params.header.column.setFilterValue(
                           filterValue.map((filter, ind) =>
                              ind === rangeFilterIndex ? e.target.value : filter
                           )
                        );
                     }}
                     value={filterValue[rangeFilterIndex] ?? ""}
                  />
               );
            },
         },
         {
            accessorKey: "jam_kirim",
            header: "Jam Surat Dikirim",
            size: 150,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "time",
            }),
         },
         {
            accessorKey: "id_file_surat",
            header: "ID Dokumen",
            size: 250,
            enableEditing: false, // disable editing on this column
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
            }),
         },
         {
            accessorKey: "nama_file_surat",
            header: "Nama Dokumen",
            size: 250,
            enableEditing: false, // disable editing on this column
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
            }),
         },
         {
            accessorKey: "nama_petugas_1",
            header: "Petugas Kasa",
            size: 150,
            editVariant: "select",
            editSelectOptions: Petugas ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "nama_petugas_2",
            header: "Petugas Kasa",
            size: 150,
            editVariant: "select",
            editSelectOptions: Petugas ?? [],
            muiEditTextFieldProps: {
               select: true,
            },
         },
         {
            accessorKey: "tgl_tugas",
            header: "Tanggal Tugas",
            size: 150,
            enableEditing: false, // disable editing on this column
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "date",
            }),
         },
         {
            accessorKey: "jam_tugas",
            header: "Jam Tugas",
            size: 150,
            enableEditing: false, // disable editing on this column
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
               type: "time",
            }),
         },
      ],
      [getCommonEditTextFieldProps]
   );
   // [finish] column definitions--------------------------------------------------------------------------------

   // [start] setting up react-query--------------------------------------------------------------------------------
   const [columnFilters, setColumnFilters] = useState([]);
   const [globalFilter, setGlobalFilter] = useState("");
   const [sorting, setSorting] = useState([{ id: "no_agenda", desc: true }]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });

   const { data: allData } = useQuery({
      queryKey: ["allTable-data"],
      queryFn: async () => {
         try {
            const response = await axios.get(
               `${import.meta.env.VITE_SERVER_LINK}/data/agendaSBKeluar`,
               {
                  params: {
                     start: pagination.pageIndex,
                     size: 9999999,
                     filters: JSON.stringify([]),
                     globalFilter: "",
                     sorting: JSON.stringify([]),
                  },
               }
            );
            return response.data;
         } catch (error) {
            throw error;
         }
      },
   });

   const { data, isError, isFetching, isLoading, refetch } = useQuery({
      queryKey: [
         "table-data",
         columnFilters, //refetch when columnFilters changes
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
                  filters: JSON.stringify(columnFilters ?? []),
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

   // Update Mutation
   const updateRowMutation = useMutation(async (updatedRow) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/update/agendaSBKeluar`; // Replace with the correct API endpoint for updating data
      try {
         // Send a PUT request to update the data on the server
         const response = await axios.put(apiUrl, updatedRow);

         return response.data;
      } catch (error) {
         throw error;
      }
   });

   // Delete Mutation
   const deleteRowMutation = useMutation(async (no_agenda) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/delete/agendaSBKeluar`; // Replace with the correct API endpoint for deleting data
      const response = await axios.delete(apiUrl, {
         params: {
            no_agenda: no_agenda,
         },
      });
      return response.data;
   });
   // [finish] setting up react-query--------------------------------------------------------------------------------

   // [start] handle CRUD operation --------------------------------------------------------------------------------

   const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
         const updatedRow = { no_agenda: row.original.no_agenda };
         const commonKeys = Object.keys(row.original).filter((key) =>
            values.hasOwnProperty(key)
         ); // Get an array of all keys that are common to both objects
         // Check if any of the common keys have different values
         for (const key of commonKeys) {
            const originalValue = String(row.original[key]); // Convert the values to strings
            const newValue = String(values[key]);
            if (originalValue !== newValue) {
               updatedRow[key] = values[key];
            }
         }

         try {
            await updateRowMutation.mutateAsync(updatedRow);

            // Optionally, you can check the response from the mutation to handle success or error
            toast.success(`Agenda ${updatedRow.no_agenda} updated successfully`);

            // Exit edit mode and reset the edit state
            exitEditingMode(); //required to exit editing mode and close modal

            // Refetch the data after updating a row to update the table
            refetch();
         } catch (error) {
            console.error(
               `Failed to update row with ID ${updatedRow.id}:`,
               error
            );
         }
      }
   };

   const handleCancelRowEdits = () => {
      setValidationErrors({});
   };

   const handleDeleteRow = async (row) => {
      if (
         !window.confirm(
            `Are you sure you want to delete Agenda ${row.original.no_agenda}`
         )
      ) {
         return;
      }
      try {
         const no_agenda = row.original.no_agenda; // Replace 'id' with the actual property that represents the unique identifier of the row
         await deleteRowMutation.mutateAsync(no_agenda);
         // Optionally, you can check the response from the mutation to handle success or error
         toast.success(`Agenda ${no_agenda} deleted successfully`);
         // Refetch the data after deleting a row to update the table
         refetch();
         // If the deletion was successful, you can update the local table data or refetch the data
         queryClient.invalidateQueries("table-data"); // Invalidate the query to trigger a refetch
      } catch (error) {
         console.error("Failed to delete the row:", error);
      }
   };

   // [finish] handle CRUD operation --------------------------------------------------------------------------------

   // [start] setting up export to CSV--------------------------------------------------------------------------------
   const headers = [
      { label: "No Agenda", key: "no_agenda" },
      { label: "No Surat", key: "no_surat" },
      { label: "Tanggal Surat", key: "tgl_surat" },
      { label: "Dari", key: "dari" },
      { label: "Kepada", key: "kepada" },
      { label: "Tembusan", key: "tembusan" },
      { label: "Jumlah Copy", key: "jumlah_copy" },
      { label: "Derajat", key: "derajat" },
      { label: "Sarkom", key: "sarkom" },
      { label: "Jumlah Halaman", key: "jml_hal" },
      { label: "Isi Berita", key: "isi_berita" },
      { label: "Tanggal Surat Diterima", key: "tgl_surat_diterima" },
      { label: "Jam Surat Diterima", key: "jam_terima" },
      { label: "Tanggal Surat Dikirim", key: "tgl_surat_dikirim" },
      { label: "Jam Surat Dikirim", key: "jam_kirim" },
      { label: "ID Dokumen", key: "id_file_surat" },
      { label: "Nama Dokumen", key: "nama_file_surat" },
      { label: "Petugas Kasa", key: "nama_petugas" },
      { label: "Tanggal Tugas", key: "tgl_tugas" },
      { label: "Jam Tugas", key: "jam_tugas" },
   ];


   const [exportData, setExportData] = useState([]); // for exporting data to CSV

   const handleExportRows = (rows) => {
      const rowData = rows.map((row) => row.original);
      setExportData(rowData);
   };

   // [finish] setting up export to CSV--------------------------------------------------------------------------------

   // [start] setting up table--------------------------------------------------------------------------------
   const table = useMaterialReactTable({
      columns: columns,
      data: data?.data ?? [],
      displayColumnDefOptions: {
         "mrt-row-actions": {
            size: 150,
            header: "",
            enablePinning: true,
            muiTableHeadCellProps: {
               align: "center", //change head cell props
            },
         },
      },
      defaultColumn: {
         minSize: 1,
      },
      enableColumnPinning: true,
      enableStickyHeader: true,
      enableStickyFooter: false,
      enableTopToolbar: true,
      enableBottomToolbar: true,
      paginationDisplayMode: "default",
      muiTableContainerProps: { sx: { maxHeight: "59vh" } },
      enableColumnResizing: false,
      enableRowNumbers: true,
      rowNumberDisplayMode: "static",
      enableHiding: true,
      enableRowSelection: true,
      editDisplayMode: "modal", //default
      enableEditing: true,
      onEditingRowSave: handleSaveRowEdits,
      onEditingRowCancel: handleCancelRowEdits,
      positionActionsColumn: "last",
      renderRowActions: ({ row, table }) => (
         <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
               <IconButton onClick={() => table.setEditingRow(row)}>
                  <EditIcon />
               </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
               <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <DeleteIcon />
               </IconButton>
            </Tooltip>
         </Box>
      ),
      renderTopToolbarCustomActions: ({ table }) => (
         <Stack>
            <Box
               sx={{
                  display: "flex",
                  gap: "0.5rem",
                  p: "0.25rem", // Reduced padding
                  flexWrap: "wrap",
               }}
            >
               <Tooltip arrow title="Refresh Data">
                  <IconButton onClick={() => refetch()}>
                     <RefreshIcon fontSize="small" />
                  </IconButton>
               </Tooltip>

               <Button
                  sx={{
                     fontSize: "0.6rem", // Reduced font size
                  }}
                  className="w-15 h-8"
                  color="success"
                  startIcon={<SimCardDownloadIcon fontSize="small" />}
                  variant="contained"
               >
                  <CSVLink
                     data={allData?.data ?? []}
                     filename="Agenda Surat Biasa Keluar.csv"
                     headers={headers}
                  >
                     Unduh All File
                  </CSVLink>{" "}
               </Button>
               <Button
                  sx={{
                     fontSize: "0.6rem", // Reduced font size
                  }}
                  disabled={table.getPrePaginationRowModel().rows.length === 0}
                  className="w-15 h-8"
                  color="success"
                  startIcon={<SimCardDownloadIcon fontSize="small" />}
                  variant="contained"
               >
                  <CSVLink
                     data={exportData}
                     filename="Custom Agenda Surat Biasa Keluar.csv"
                     headers={headers}
                     onClick={()=>handleExportRows(table.getRowModel().rows)}
                  >
                     Unduh Page Filtered File
                  </CSVLink>
               </Button>
               <Button
                  sx={{
                     fontSize: "0.6rem", // Reduced font size
                  }}
                  disabled={
                     !table.getIsSomeRowsSelected() &&
                     !table.getIsAllRowsSelected()
                  }
                  className="w-15 h-8"
                  color="success"
                  onClick={() =>
                     handleExportRows(table.getSelectedRowModel().rows)
                  }
                  startIcon={<SimCardDownloadIcon fontSize="small" />}
                  variant="contained"
               >
                  
                  <CSVLink
                     data={exportData}
                     filename="Custom Agenda Surat Biasa Keluar.csv"
                     headers={headers}
                     onClick={()=> handleExportRows(table.getSelectedRowModel().rows)}
                  >
                    Unduh Selected Rows
                  </CSVLink>
               </Button>
            </Box>
         </Stack>
      ),
      initialState: { showColumnFilters: false },
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      muiToolbarAlertBannerProps: isError
         ? {
              color: "error",
              children: "Error loading data",
           }
         : undefined,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      rowCount: data?.meta?.totalRowCount ?? 0,
      state: {
         columnFilters,
         globalFilter,
         isLoading,
         pagination,
         showAlertBanner: isError,
         showProgressBars: isFetching,
         sorting,
      },
   });
   // [finish] setting up table--------------------------------------------------------------------------------

   return (
      <>
         <div className="flex flex-col col-span-ful  ">
            <h1 className="text-lg font-semibold text-center m-2 p-2 bg-[#C7D2FE] text-slate-700">
               Agenda Surat Biasa Keluar
            </h1>

            <div className="mx-2">
               <MaterialReactTable table={table} />
            </div>
         </div>
      </>
   );
};

export default SBKeluar;
