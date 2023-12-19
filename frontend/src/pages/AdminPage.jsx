import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
   useMaterialReactTable,
   MaterialReactTable,
} from "material-react-table";

import { toast } from "react-toastify";
import { Button, Stack, Box, Tooltip, IconButton,Dialog, DialogTitle, DialogContent, TextField,DialogActions } from "@mui/material";

// Material-UI Icons Imports
import RefreshIcon from "@mui/icons-material/Refresh";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

const AdminPage = () => {
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
            accessorKey: "kd_alamat",
            header: "Kode Alamat",
            enableEditing: false, // disable editing on this column
            size: 1,
         },
         {
            accessorKey: "alamat_eksternal",
            header: "Alamat Eksternal",
            size: 20,
            muiEditTextFieldProps: ({ cell }) => ({
               ...getCommonEditTextFieldProps(cell),
            }),
         },
         {
            accessorKey: "tgl_tugas",
            header: "Tanggal Tugas",
            size: 20,
            enableEditing: false, // disable editing on this column
         },
         {
            accessorKey: "jam_tugas",
            header: "Jam Tugas",
            size: 20,
            enableEditing: false, // disable editing on this column
         },
      ],
      [getCommonEditTextFieldProps]
   );
   // [finish] column definitions--------------------------------------------------------------------------------

   // [start] setting up react-query--------------------------------------------------------------------------------

   const { data, isError, isFetching, isLoading, refetch } = useQuery({
      queryKey: ["table-data"],
      queryFn: async () => {
         const apiUrl = `${
            import.meta.env.VITE_SERVER_LINK
         }/data/allalamatsurateksternal`;

         try {
            const response = await axios.get(apiUrl);
            return response.data;
         } catch (error) {
            throw error;
         }
      },
      keepPreviousData: true,
   });

   // Create Mutation
   const createRowMutation = useMutation(async (newRow) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/upload/alamatsurateksternal`; // API endpoint for creating data
      const response = await axios.post(apiUrl, newRow);

      return response.data;
   });

   // Update Mutation
   const updateRowMutation = useMutation(async (updatedRow) => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/update/agendaSBMasuk`; // Replace with the correct API endpoint for updating data
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
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/delete/agendaSBMasuk`; // Replace with the correct API endpoint for deleting data
      const response = await axios.delete(apiUrl, {
         params: {
            no_agenda: no_agenda,
         },
      });
      return response.data;
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

   // [start] setting up table--------------------------------------------------------------------------------
   const table = useMaterialReactTable({
      data: data?.data ?? [],
      columns: columns,
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
      positionActionsColumn: "last",
      enableRowActions: true,
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
                  color="secondary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                  startIcon={<UploadFileRoundedIcon fontSize="small" />}
               >
                  Tambah Data
               </Button>
            </Box>
         </Stack>
      ),
      initialState: {
         showColumnFilters: false,
         showGlobalFilter: false,
      },
      muiToolbarAlertBannerProps: isError
         ? {
              color: "error",
              children: "Error loading data",
           }
         : undefined,
      state: {
         showAlertBanner: isError,
         showProgressBars: isFetching,
      },
   });
   // [finish] setting up table--------------------------------------------------------------------------------
   return (
      <>
         <div className="flex flex-col col-span-ful  ">
            <h1 className="text-lg font-semibold text-center m-2 p-2 bg-[#C7D2FE] text-slate-700">
               Alamat Eksternal
            </h1>

            <div className="mx-2">
               <MaterialReactTable table={table} />
            </div>

            <CreateNewAccountModal
               columns={columns}
               open={createModalOpen}
               onClose={() => setCreateModalOpen(false)}
               onSubmit={handleCreateNewRow}
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
}) => {

   // [start] configure validation errors--------------------------------------------------------------------------------
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

   // [finish] configure validation errors--------------------------------------------------------------------------------

   const [values, setValues] = useState(() =>
      columns.reduce((acc, column) => {
         acc[column.accessorKey ?? ""] = "";
         return acc;
      }, {})
   );

   const handleSubmit = () => {
      const keysToExclude = [
         "kd_alamat",
         "tgl_tugas",
         "jam_tugas"
      ];
      let emptyKey = false;

      for (const [key, value] of Object.entries(values)) {
         if (!value && !keysToExclude.includes(key)) {
            console.log(key, value )
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
      <Dialog  open={open}>
         <DialogTitle
            textAlign="center"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
         >
            Tambah Data
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
                        key="alamat_eksternal"
                        label="Alamat Eksternal"
                        name="alamat_eksternal"
                        variant="filled"
                        value={values.no_surat}
                        onChange={(e) =>
                           setValues({
                              ...values,
                              [e.target.name]: e.target.value,
                           })
                        }
                        {...getCommonEditTextFieldProps({ label: "Alamat Eksternal" })}
                     />
                  </Stack>
               </div>
            </form>
         </DialogContent>
         <DialogActions sx={{ p: "1.25rem" }}>
            <Button
               onClick={() => {
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
            >
               Tambah File
            </Button>
         </DialogActions>
      </Dialog>
   );
};


export default AdminPage;
