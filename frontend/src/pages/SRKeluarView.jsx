import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
   MaterialReactTable,
   useMaterialReactTable,
   MRT_EditActionButtons,
} from "material-react-table";
import { useQuery, useMutation } from "@tanstack/react-query";

import axios from "axios";

// Material-UI Icons Imports
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import FileOpenIcon from "@mui/icons-material/FileOpen";

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

import {
   useAlamatSuratEksternal,
   useAlamatSuratInternal,
   useDerajat,
   useSarkom,
   useSistem,
   usePetugas,
} from "../data/DataMaster";

import PdfViewer from "../components/PdfViewer";
// custom alert
import { toast } from "react-toastify";

const SRKeluarView = () => {
   // [start] fetch pdf file--------------------------------------------------------------------------------
   const [pdfFile, setPdfFile] = useState(null);
   const [fileId, setFileId] = useState("");
   const fetchPdf = async (fileId) => {
      try {
         const response = await axios.get(
            `${import.meta.env.VITE_SERVER_LINK}/download/${fileId}`,
            {
               responseType: "blob",
            }
         );
         return response.data;
      } catch (error) {
         throw error;
      }
   };

   useEffect(() => {
      try {
         if (fileId) {
            fetchPdf(fileId)
               .then((res) => {
                  setPdfFile(res);
               })
               .catch((err) => {
                  console.log(err);
               });
         }
      } catch (error) {
         console.error("Error fetching PDF:", error);
      }
   }, [fileId]);

   // [finish] fetch pdf file--------------------------------------------------------------------------------

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
            accessorKey: "sistem",
            header: "Sistem",
            size: 150,
            editVariant: "select",
            editSelectOptions: Sistem,
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
               maxRows: 2,
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
         }/data/agendasrkeluar`;
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

   // Create Mutation
   const createRowMutation = useMutation(async (newRow) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/upload/agendasrkeluar`; // API endpoint for creating data
      const response = await axios.post(apiUrl, newRow, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      return response.data;
   });

   // Update Mutation
   const updateRowMutation = useMutation(async (updatedRow) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/update/agendasrkeluar`; // Replace with the correct API endpoint for updating data
      try {
         // Send a PUT request to update the data on the server
         const response = await axios.put(apiUrl, updatedRow);

         return response.data;
      } catch (error) {
         throw error;
      }
   });

   // [finish] setting up react-query--------------------------------------------------------------------------------

   // [start] handle CRUD operation --------------------------------------------------------------------------------
   const [createModalOpen, setCreateModalOpen] = useState(false);

   const handleCreateNewRow = async (values) => {
      try {
         const newData = values;
         await createRowMutation.mutateAsync(newData);
         toast.success("New row created successfully");
         refetch(); // Refetch the data after creating a new row to update the table
         setCreateModalOpen(false); // Close the create modal if needed
      } catch (error) {
         console.error("Failed to create a new row:", error);
      }
   };

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
            toast.success(
               `Agenda ${updatedRow.no_agenda} updated successfully`
            );

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

   // [finish] handle CRUD operation --------------------------------------------------------------------------------

   // [start] setting up table--------------------------------------------------------------------------------
   const table = useMaterialReactTable({
      columns: columns,
      data: data?.data ?? [],
      displayColumnDefOptions: {
         "mrt-row-actions": {
            header: "", //change header text
            size: 20,
         },
      },
      defaultColumn: {
         minSize: 1,
      },
      enableColumnPinning: false,
      enableStickyHeader: true,
      enableStickyFooter: false,
      enableTopToolbar: true,
      enableBottomToolbar: true,
      paginationDisplayMode: "default",
      muiTableContainerProps: { sx: { maxHeight: "59vh" } },
      enableColumnResizing: false,
      enableRowNumbers: true,
      rowNumberDisplayMode: "static",
      enableHiding: false,
      enableRowSelection: false,
      editDisplayMode: "modal", //default
      enableEditing: true,
      onEditingRowSave: handleSaveRowEdits,
      onEditingRowCancel: handleCancelRowEdits,
      muiEditRowDialogProps: {
         fullScreen: true,
      },
      renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
         setFileId(row.original.id_file_surat);

         return (
            <>
               <DialogTitle className="text-center" variant="h6">
                  Detail Agenda
               </DialogTitle>
               <DialogContent
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     gap: "1.5rem",
                  }}
               >
                  <div className="flex">
                     <div className="basis-6/12 flex flex-col gap-10 text-xs">
                        {internalEditComponents}
                     </div>
                     <div className="basis-6/12 px-10">
                        <div className="sticky top-0">
                           <PdfViewer
                              pdf={pdfFile}
                              name={row.original.nama_file_surat}
                           />
                        </div>
                     </div>
                  </div>
               </DialogContent>
               <DialogActions className="text-sm">
                  <MRT_EditActionButtons
                     variant="text"
                     table={table}
                     row={row}
                  />
               </DialogActions>
            </>
         );
      },
      positionActionsColumn: "last",
      enableRowActions: true,
      renderRowActions: ({ row, table }) => (
         <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Detail Surat">
               <IconButton onClick={() => table.setEditingRow(row)}>
                  <FileOpenIcon />
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
                  color="secondary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                  startIcon={<UploadFileRoundedIcon fontSize="small" />}
               >
                  Tambah File
               </Button>
            </Box>
         </Stack>
      ),
      initialState: {
         showColumnFilters: false,
         showGlobalFilter: false,
         columnVisibility: {
            tembusan: false,
            jumlah_copy: false,
            derajat: false,
            sarkom: false,
            sistem:false,
            jml_hal: false,
            tgl_surat_diterima: false,
            jam_terima: false,
            tgl_surat_dikirim: false,
            jam_kirim: false,
            id_file_surat: false,
            nama_file_surat: false,
            nama_petugas_1: false,
            nama_petugas_2: false,
            tgl_tugas: false,
            jam_tugas: false,
         },
      },
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
               Agenda Surat Rahasia Keluar
            </h1>

            <div className="mx-2">
               <MaterialReactTable table={table} />
            </div>

            <CreateNewAccountModal
               columns={columns}
               open={createModalOpen}
               onClose={() => setCreateModalOpen(false)}
               onSubmit={handleCreateNewRow}
               Dari={Dari ?? []}
               Kepada={Kepada ?? []}
               Derajat={Derajat ?? []}
               Sarkom={Sarkom ?? []}
               Sistem={Sistem ?? []}
               Petugas={Petugas ?? []}
            />
         </div>
      </>
   );
};

export const CreateNewAccountModal = ({
   open,
   columns,
   onClose,
   onSubmit,
   Dari,
   Kepada,
   Derajat,
   Sarkom,
   Sistem,
   Petugas,
}) => {
   const DariModal = Dari;
   const KepadaModal = Kepada;
   const DerajatModal = Derajat;
   const SarkomModal = Sarkom;
   const SistemModal = Sistem;
   const PetugasModal = Petugas;

   // [start] configure validation errors--------------------------------------------------------------------------------
   const [fileIsValid, setFileIsValid] = useState(false);
   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.match("application/pdf")) {
         // Clear the file input
         e.target.value = "";
         toast.error("Only accept pdf!");
      } else if (selectedFile) {
         setValues({
            ...values,
            file: selectedFile,
         });
         setFileIsValid(true);
      } else {
         setFileIsValid(false);
      }
   };

   const [validationErrors, setValidationErrors] = useState({});

   const validateRequired = (value) => !!value.length;
   const validateEmail = (email) =>
      !!email.length &&
      email
         .toLowerCase()
         .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         );
   const validateAge = (age) => age >= 18 && age <= 50;

   const getCommonEditTextFieldProps = useCallback(
      (cell) => {
         return {
            error: !!validationErrors[cell.label],
            helperText: validationErrors[cell.label],
            onBlur: (event) => {
               const isValid =
                  cell.label === "email"
                     ? validateEmail(event.target.value)
                     : cell.label === "age"
                     ? validateAge(+event.target.value)
                     : validateRequired(event.target.value);

               if (!isValid) {
                  // Set validation error for cell if invalid
                  setValidationErrors({
                     ...validationErrors,
                     [cell.label]: `${cell.label} is required`,
                  });
               } else {
                  // Remove validation error for cell if valid
                  const updatedValidationErrors = { ...validationErrors };
                  delete updatedValidationErrors[cell.label];
                  setValidationErrors(updatedValidationErrors);
               }
            },
         };
      },
      [validationErrors]
   );

   const [formIsValid, setFormIsValid] = useState(false);

   useEffect(() => {
      // Check if the file is valid and there are no validation errors
      const newFormIsValid =
         fileIsValid && Object.keys(validationErrors).length === 0;

      // Update the formIsValid state
      setFormIsValid(newFormIsValid);
   }, [fileIsValid, validationErrors]);

   // [finish] configure validation errors--------------------------------------------------------------------------------

   const [values, setValues] = useState(() =>
      columns.reduce((acc, column) => {
         acc[column.accessorKey ?? ""] = "";
         return acc;
      }, {})
   );

   const handleSubmit = () => {
      const keysToExclude = [
         "id_file_surat",
         "jam_tugas",
         "tgl_tugas",
         "nama_file_surat",
         "no_agenda",
      ];
      let emptyKey = false;

      for (const [key, value] of Object.entries(values)) {
         if (!value && !keysToExclude.includes(key)) {
            emptyKey = true;
         }
      }

      if (emptyKey) {
         toast.error("Semua data harus terisi!");
         return;
      }

      // Call the onSubmit callback with the values
      onSubmit(values);

      // Empty the values state
      const newValues = () =>
         columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ""] = "";
            return acc;
         }, {});

      // Set the new empty object as the state for 'values'
      setValues(newValues);

      onClose();
   };

   return (
      <Dialog fullScreen open={open}>
         <DialogTitle
            textAlign="center"
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
         >
            Tambah File
         </DialogTitle>
         <DialogContent>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
               <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <Stack
                     sx={{
                        width: "100%",
                        minWidth: { xs: "300px", sm: "360px", md: "400px" },
                        gap: "2rem",
                        flex: 1,
                        padding: "1rem",
                     }}
                  >
                     <TextField
                        key="no_surat"
                        label="No Surat"
                        name="no_surat"
                        variant="filled"
                        value={values.no_surat}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "No Surat" })}
                     />
                     <TextField
                        key="tgl_surat"
                        label="Tanggal Surat"
                        name="tgl_surat"
                        type="date"
                        variant="filled"
                        InputLabelProps={{
                           shrink: true,
                        }}
                        value={values.tgl_surat}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Tanggal Surat",
                        })}
                     />
                     <TextField
                        key="dari"
                        label="Dari"
                        name="dari"
                        select
                        variant="filled"
                        value={values.dari}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Dari" })}
                     >
                        {DariModal.map((dari) => (
                           <MenuItem key={dari} value={dari}>
                              {dari}
                           </MenuItem>
                        ))}
                     </TextField>
                     <TextField
                        key="kepada"
                        label="Kepada"
                        name="kepada"
                        select
                        variant="filled"
                        value={values.kepada}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Kepada" })}
                     >
                        {KepadaModal.map((kepada) => (
                           <MenuItem key={kepada} value={kepada}>
                              {kepada}
                           </MenuItem>
                        ))}
                     </TextField>
                     <TextField
                        key="tembusan"
                        label="Tembusan"
                        name="tembusan"
                        type="text"
                        variant="filled"
                        value={values.tembusan}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Tembusan" })}
                     />
                     <TextField
                        key="jumlah_copy"
                        label="Jumlah Copy"
                        name="jumlah_copy"
                        type="number"
                        variant="filled"
                        value={values.jumlah_copy}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Jumlah Copy",
                        })}
                     />
                     <TextField
                        key="derajat"
                        label="Derajat"
                        name="derajat"
                        select
                        variant="filled"
                        value={values.derajat}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Derajat" })}
                     >
                        {DerajatModal.map((derajat) => (
                           <MenuItem key={derajat} value={derajat}>
                              {derajat}
                           </MenuItem>
                        ))}
                     </TextField>
                     <TextField
                        key="sarkom"
                        label="Sarkom"
                        name="sarkom"
                        select
                        variant="filled"
                        value={values.sarkom}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Sarkom" })}
                     >
                        {SarkomModal.map((sarkom) => (
                           <MenuItem key={sarkom} value={sarkom}>
                              {sarkom}
                           </MenuItem>
                        ))}
                     </TextField>
                     <TextField
                        key="sistem"
                        label="Sistem"
                        name="sistem"
                        select
                        variant="filled"
                        value={values.sistem}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Sistem" })}
                     >
                        {SistemModal.map((sistem) => (
                           <MenuItem key={sistem} value={sistem}>
                              {sistem}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Stack>
                  <Stack
                     sx={{
                        width: "100%",
                        minWidth: { xs: "300px", sm: "360px", md: "400px" },
                        gap: "1.65rem",
                        flex: 1,
                        padding: "1rem",
                     }}
                  >
                     <TextField
                        key="jml_hal"
                        label="Jumlah Halaman"
                        name="jml_hal"
                        type="number"
                        variant="filled"
                        value={values.jml_hal}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Jumlah Halaman",
                        })}
                     />

                     <TextField
                        key="isi_berita"
                        label="Isi Berita"
                        name="isi_berita"
                        multiline
                        rows={3}
                        variant="filled"
                        value={values.isi_berita}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Isi Berita",
                        })}
                     />

                     <TextField
                        key="tgl_surat_diterima"
                        label="Tanggal Surat Diterima"
                        name="tgl_surat_diterima"
                        type="date"
                        variant="filled"
                        InputLabelProps={{
                           shrink: true,
                        }}
                        value={values.tgl_surat_diterima}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Tanggal Surat Diterima",
                        })}
                     />

                     <TextField
                        key="jam_terima"
                        label="Jam Surat Diterima"
                        name="jam_terima"
                        type="time"
                        variant="filled"
                        InputLabelProps={{
                           shrink: true,
                        }}
                        value={values.jam_terima}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Jam Surat Diterima",
                        })}
                     />

                     <TextField
                        key="tgl_surat_dikirim"
                        label="Tanggal Surat Dikirim"
                        name="tgl_surat_dikirim"
                        type="date"
                        variant="filled"
                        InputLabelProps={{
                           shrink: true,
                        }}
                        value={values.tgl_surat_dikirim}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Tanggal Surat Dikirim",
                        })}
                     />

                     <TextField
                        key="jam_kirim"
                        label="Jam Surat Dikirim"
                        name="jam_kirim"
                        type="time"
                        variant="filled"
                        InputLabelProps={{
                           shrink: true,
                        }}
                        value={values.jam_kirim}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Jam Surat Dikirim",
                        })}
                     />

                     <input
                        key="file"
                        label="File"
                        name="File"
                        type="file"
                        accept="application/pdf"
                        variant="filled"
                        className="my-3"
                        onChange={handleFileChange}
                     />

                     <TextField
                        key="nama_petugas_1"
                        label="Petugas Kasa"
                        name="nama_petugas_1"
                        select
                        variant="filled"
                        value={values.nama_petugas_1}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Petugas Kasa",
                        })}
                     >
                        {PetugasModal.map((petugas) => (
                           <MenuItem key={petugas} value={petugas}>
                              {petugas}
                           </MenuItem>
                        ))}
                     </TextField>

                     <TextField
                        key="nama_petugas_2"
                        label="Petugas Kasa"
                        name="nama_petugas_2"
                        select
                        variant="filled"
                        value={values.nama_petugas_2}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({
                           label: "Petugas Kasa",
                        })}
                     >
                        {PetugasModal.map((petugas) => (
                           <MenuItem key={petugas} value={petugas}>
                              {petugas}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Stack>
               </div>
            </form>
         </DialogContent>
         <DialogActions sx={{ p: "1.25rem" }}>
            <Button
               onClick={() => {
                  setFileIsValid(false);

                  // Empty the values state
                  const newValues = () =>
                     columns.reduce((acc, column) => {
                        acc[column.accessorKey ?? ""] = "";
                        return acc;
                     }, {});

                  // Set the new empty object as the state for 'values'
                  setValues(newValues);
                  setValidationErrors({});

                  onClose();
               }}
            >
               Cancel
            </Button>
            <Button
               color="secondary"
               onClick={handleSubmit}
               variant="contained"
               disabled={!formIsValid} // Disable the button if the file is not valid
            >
               Tambah File
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default SRKeluarView;
