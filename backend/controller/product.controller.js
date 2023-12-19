const { nextTick } = require("process");
const db = require("../configs/db.config");
const productServices = require('../services/product.services')
const crypto = require("crypto");
const fs = require("fs");
const multer = require('multer')
require('dotenv').config();


const alamatsurateksternal = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getAlamatSuratEksternal();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const alamatsuratinternal = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getAlamatSuratInternal();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const derajat = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getDerajat();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const sarkom = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getSarkom();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const sistem = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getSistem();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const petugas = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getPetugas();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).send(data);
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const handleFileSent = async (req, res, next) => {
   try {
      const storage = multer.memoryStorage();
      const upload = multer({ storage: storage });
      upload.single('file')(req, res, (err) => {
         if (err) {
            // Handle the error (e.g., send an error response or call `next` with the error)
            return next(err);
         }
         // File uploaded successfully
         next();
      });
   } catch (err) {
      // Handle any other potential errors here
      next(err);
   }

}

const uploadFile = async (req, res, next) => {
   if (!req.file) {
      return res.status(400).send("No file uploaded.");
   }

   // [start] encrypt file with aes-256-cbc algorithm --------------------------------------------
   const aesKey = crypto.randomBytes(32);// 256 bits key

   const iv = crypto.randomBytes(16);// Generate a random 16-byte Initialization Vector (IV)

   // Create a new Cipher object using the AES-256-CBC algorithm, the encrypted aesKey, and the encrypted iv
   const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

   // Encrypt the data using the Cipher object
   let encryptedData = Buffer.concat([
      cipher.update(req.file.buffer), // Pass the data to be encrypted to the Cipher object
      cipher.final(), // Finalize the encryption process and return the encrypted data as a Buffer object
   ]);
   // [finish] encrypt file with aes-256-cbc algorithm --------------------------------------------



   // [start] save encrypted file to disk ---------------------------------------------------------
   const fileId = crypto.randomUUID(); // Generate a unique file ID

   // Save the encrypted data to a file on the server
   const filePath = `./encrypted_files/${fileId}.dat`;
   fs.writeFileSync(filePath, encryptedData);
   console.log(`File saved to disk with id: ${fileId}`);
   // [finish] save encrypted file to disk ---------------------------------------------------------



   // [start] encrypt aesKey and iv with aes-256-cbc algorithm ------------------------------------
   // Retrieve the master key and master IV from the environment variables
   const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');
   const masterIv = Buffer.from(process.env.MASTER_IV, 'hex');

   // Create a new Cipher object using the AES-256-CBC algorithm, the master key, and the master IV for aesKey
   const aesKeyCipher = crypto.createCipheriv("aes-256-cbc", masterKey, masterIv);
   // Encrypt the aesKey and iv using the Cipher object and the master key
   encryptedAesKey = Buffer.concat([aesKeyCipher.update(aesKey), aesKeyCipher.final()]);

   // Create a new Cipher object using the AES-256-CBC algorithm, the master key, and the master IV for iv
   const ivCipher = crypto.createCipheriv("aes-256-cbc", masterKey, masterIv);
   // Encrypt the aesKey and iv using the Cipher object and the master key
   encryptedIv = Buffer.concat([ivCipher.update(iv), ivCipher.final()]);
   // [finish] encrypt aesKey and iv with aes-256-cbc algorithm ------------------------------------




   // [start] save files metadata to database ------------------------------------------------------   
   // Store file metadata in the database
   const file_metadata = {
      fileId: fileId,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      encryptedAesKey: encryptedAesKey.toString('hex'),
      encryptedIv: encryptedIv.toString('hex')
   }

   try {
      await productServices.insertFileMetadata(file_metadata);
      req.body.id_file_surat = fileId;
      req.body.nama_file_surat = req.file.originalname;
      console.log("file metadata inserted");

      if (req.url.includes("/upload/agenda")) {
         next()
      } else if (req.url === "/upload") {
         res.status(200).send("File metadata inserted.");
      }

   } catch (error) {
      console.log(error);
      // res.status(500).send("Error storing file metadata.");
   }

   // [finish] save files metadata to database ------------------------------------------------------

};

const downloadFile = async (req, res) => {
   const fileId = req.params.fileId.replace(/^\s+|\s+$/g, ''); // Remove any whitespace from the file ID
   console.log("fileId in downloadFile", fileId)

   try {
      // Retrieve file metadata from the database
      const query =
         `SELECT nama_file_surat, mimetype, encrypted_aes_key, encrypted_iv FROM files_metadata WHERE id_file_surat = '${fileId}'`;

      const result = await db.query(query);

      if (result.rowCount === 0) {
         return res.status(404).send('File not found.');
      }

      let { nama_file_surat, mimetype, encrypted_aes_key, encrypted_iv } = result.rows[0];

      encrypted_aes_key = Buffer.from(encrypted_aes_key, 'hex');
      encrypted_iv = Buffer.from(encrypted_iv, 'hex');

      // Read the encrypted data from the file on the server
      const filePath = `./encrypted_files/${fileId}.dat`;
      const encryptedData = fs.readFileSync(filePath);

      // Retrieve the master key and master IV from the environment variables
      const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');
      const masterIv = Buffer.from(process.env.MASTER_IV, 'hex');

      // Create a new Decipher object using the AES-256-CBC algorithm for aesKey
      const aesDecipher = crypto.createDecipheriv('aes-256-cbc', masterKey, masterIv);
      let decryptedAesKey = Buffer.concat([aesDecipher.update(encrypted_aes_key), aesDecipher.final()]);

      // Create a new Decipher object using the AES-256-CBC algorithm for iv
      const ivDecipher = crypto.createDecipheriv('aes-256-cbc', masterKey, masterIv);
      let decryptedIv = Buffer.concat([ivDecipher.update(encrypted_iv), ivDecipher.final()]);

      // Decrypt the file using AES
      const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedAesKey, decryptedIv);
      let decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

      // Send the decrypted data as a file
      res.setHeader('Content-Type', mimetype);
      //   res.setHeader('Content-Disposition', `inline; filename=${nama_file_surat}`);
      res.setHeader('Content-Disposition', 'inline; filename="' + nama_file_surat + '"');

      res.send(decryptedData);


   } catch (error) {
      console.error('Error:', error);
      if(error.code === 'ENOENT'){
         res.status(404).send('File not found on the server.');
      }else if(error instanceof crypto.DecipherError){
         res.status(500).send('Error decrypting file.');
      }else{
         res.status(500).send('An internal server error occurred.');
      }

   }
};

//[start] Alamat Surat Eksternal -------------------------------------------------
const allalamatsurateksternal = async (req, res) => {
   try {
      // Declare 'data' variable and initialize it with a default value.
      let data = null;

      // Call the 'getAlamatSuratEksternal' function from 'productServices'.
      // Make sure to handle errors that might occur in this function.
      data = await productServices.getAllAlamatSuratEksternal();

      // Check if 'data' is not null or undefined before sending a response.
      if (data) {
         res.status(200).json({data:data});
      } else {
         // Handle the case where 'data' is not available.
         res.status(404).json({ error: "Data not found" });
      }
   } catch (error) {
      // Handle errors by sending an appropriate response or logging them.
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const insertalamatsurateksternal = async (req, res) => {
   console.log('checccccccc')
   console.log("req body in alamatsurateksternal", req.body)

   try {
      await productServices.insertAlamatSuratEksternal(req.body);
      console.log("alamatsurateksternal inserted")
   } catch (error) {
      console.log(error);
      res.status(500).send("Error inserting agenda surat biasa keluar.");
   }
}
//[finish] Alamat Surat Eksternal -------------------------------------------------

// [start] Agenda Biasa Masuk -------------------------------------------------

const insertagendasbmasuk = async (req, res) => {

   console.log("req body in insertagendasbmasuk", req.body)

   try {
      await productServices.insertAgendaSBMasuk(req.body);
      console.log("agenda surat biasa keluar inserted")
      res.status(200).send("Agenda surat biasa keluar berhasil ditambahkan.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error inserting agenda surat biasa keluar.");
   }
}

const dataagendasbmasuk = async (req, res) => {
   let dbData = await productServices.getAgendaSBMasuk();

   console.log("req query in dataagendasbmasuk", req.query)

   const { start, size, filters, sorting, globalFilter } = req.query;

   const parsedColumnFilters = JSON.parse(filters);

   if (parsedColumnFilters?.length) {
      const dateFilters = parsedColumnFilters.filter((item) => item.id.includes('tgl'));
      const otherFilters = parsedColumnFilters.filter((item) => !item.id.includes('tgl'))

      // // Apply other filters
      otherFilters.forEach((filter) => {
         const { id: columnId, value: filterValue } = filter;
         dbData = dbData.filter((row) => {
            return (
               row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ?? false
            );
         });
      });
      // // Apply date range filter

      if (dateFilters) {

         dateFilters.forEach((filter) => {
            const { id: columnId, value: dateRange } = filter;

            dbData = dbData.filter((row) => {
               const rowDate = row[columnId]
               const startDate = dateRange[0]
               const endDate = dateRange[1]

               // Check conditions for filtering
               if (!startDate && !endDate) {
                  // If no startDate and no endDate are provided, include all records.
                  return true;
               } else if (startDate && !endDate) {
                  // If only startDate is provided, filter for dates greater than or equal to startDate.
                  return rowDate >= startDate;
               } else if (!startDate && endDate) {
                  // If only endDate is provided, filter for dates less than or equal to endDate.
                  return rowDate <= endDate;
               } else {
                  // If both startDate and endDate are provided, filter for dates within the specified range.
                  return rowDate >= startDate && rowDate <= endDate;
               }
            })
         })
      }
   }

   if (globalFilter) {
      dbData = dbData.filter((row) =>
         Object.keys(row).some((columnId) =>
            row[columnId]
               ?.toString()
               ?.toLowerCase()
               ?.includes(globalFilter.toLowerCase())
         )
      );
   }

   const parsedSorting = JSON.parse(sorting);

   if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
         if (desc) {
            return a[id] < b[id] ? 1 : -1;
         }
         return a[id] > b[id] ? 1 : -1;
      });
   }

   const startIdx = parseInt(start);
   const endIdx = startIdx + parseInt(size);

   res.status(200).json({
      data: dbData.slice(startIdx, endIdx),
      meta: { totalRowCount: dbData.length },
   });
};

const updateagendasbmasuk = async (req, res) => {

   try {
      await productServices.updateAgendaSBMasuk(req.body);
      console.log("agenda surat biasa keluar updated")
      res.status(200).send("Agenda surat biasa keluar berhasil diupdate.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error updating agenda surat biasa keluar.");
   }
}

const deleteagendasbmasuk = async (req, res) => {
   try {
      await productServices.deleteAgendaSBMasuk(req.query.no_agenda);
      console.log("agenda surat biasa keluar deleted")
      res.status(200).send("Agenda surat biasa keluar berhasil dihapus.");
   } catch (error) {
      console.log(error);
   }
}
// [finish] Agenda Biasa Masuk -------------------------------------------------


// [start] Agenda Biasa Keluar -------------------------------------------------

const insertagendasbkeluar = async (req, res) => {

   console.log("req body in insertagendasbkeluar", req.body)

   try {
      await productServices.insertAgendaSBKeluar(req.body);
      console.log("agenda surat biasa keluar inserted")
      res.status(200).send("Agenda surat biasa keluar berhasil ditambahkan.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error inserting agenda surat biasa keluar.");
   }
}

const dataagendasbkeluar = async (req, res) => {
   let dbData = await productServices.getAgendaSBKeluar();

   console.log("req query in dataagendasbkeluar", req.query)

   const { start, size, filters, sorting, globalFilter } = req.query;

   const parsedColumnFilters = JSON.parse(filters);

   if (parsedColumnFilters?.length) {
      const dateFilters = parsedColumnFilters.filter((item) => item.id.includes('tgl'));
      const otherFilters = parsedColumnFilters.filter((item) => !item.id.includes('tgl'))

      // // Apply other filters
      otherFilters.forEach((filter) => {
         const { id: columnId, value: filterValue } = filter;
         dbData = dbData.filter((row) => {
            return (
               row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ?? false
            );
         });
      });
      // // Apply date range filter

      if (dateFilters) {

         dateFilters.forEach((filter) => {
            const { id: columnId, value: dateRange } = filter;

            dbData = dbData.filter((row) => {
               const rowDate = row[columnId]
               const startDate = dateRange[0]
               const endDate = dateRange[1]

               // Check conditions for filtering
               if (!startDate && !endDate) {
                  // If no startDate and no endDate are provided, include all records.
                  return true;
               } else if (startDate && !endDate) {
                  // If only startDate is provided, filter for dates greater than or equal to startDate.
                  return rowDate >= startDate;
               } else if (!startDate && endDate) {
                  // If only endDate is provided, filter for dates less than or equal to endDate.
                  return rowDate <= endDate;
               } else {
                  // If both startDate and endDate are provided, filter for dates within the specified range.
                  return rowDate >= startDate && rowDate <= endDate;
               }
            })
         })
      }
   }

   if (globalFilter) {
      dbData = dbData.filter((row) =>
         Object.keys(row).some((columnId) =>
            row[columnId]
               ?.toString()
               ?.toLowerCase()
               ?.includes(globalFilter.toLowerCase())
         )
      );
   }

   const parsedSorting = JSON.parse(sorting);

   if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
         if (desc) {
            return a[id] < b[id] ? 1 : -1;
         }
         return a[id] > b[id] ? 1 : -1;
      });
   }

   const startIdx = parseInt(start);
   const endIdx = startIdx + parseInt(size);

   res.status(200).json({
      data: dbData.slice(startIdx, endIdx),
      meta: { totalRowCount: dbData.length },
   });
};

const updateagendasbkeluar = async (req, res) => {

   try {
      await productServices.updateAgendaSBKeluar(req.body);
      console.log("agenda surat biasa keluar updated")
      res.status(200).send("Agenda surat biasa keluar berhasil diupdate.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error updating agenda surat biasa keluar.");
   }
}

const deleteagendasbkeluar = async (req, res) => {
   try {
      await productServices.deleteAgendaSBKeluar(req.query.no_agenda);
      console.log("agenda surat biasa keluar deleted")
      res.status(200).send("Agenda surat biasa keluar berhasil dihapus.");
   } catch (error) {
      console.log(error);
   }
}
// [finish] Agenda Biasa Keluar -------------------------------------------------

// [start] Agenda Rahasia Masuk -------------------------------------------------

const insertagendasrmasuk = async (req, res) => {

   console.log("req body in insertagendasrbmasuk", req.body)
   try {
      await productServices.insertAgendaSRMasuk(req.body);
      console.log("agenda surat rahasia masuk inserted")
      res.status(200).send("Agenda surat rahasia masuk berhasil ditambahkan.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error inserting agenda surat rahasia masuk.");
   }
}

const dataagendasrmasuk = async (req, res) => {
   let dbData = await productServices.getAgendaSRMasuk();

   console.log("req query in dataagendasrmasuk", req.query)

   const { start, size, filters, sorting, globalFilter } = req.query;

   const parsedColumnFilters = JSON.parse(filters);

   if (parsedColumnFilters?.length) {
      const dateFilters = parsedColumnFilters.filter((item) => item.id.includes('tgl'));
      const otherFilters = parsedColumnFilters.filter((item) => !item.id.includes('tgl'))

      // // Apply other filters
      otherFilters.forEach((filter) => {
         const { id: columnId, value: filterValue } = filter;
         dbData = dbData.filter((row) => {
            return (
               row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ?? false
            );
         });
      });
      // // Apply date range filter

      if (dateFilters) {

         dateFilters.forEach((filter) => {
            const { id: columnId, value: dateRange } = filter;

            dbData = dbData.filter((row) => {
               const rowDate = row[columnId]
               const startDate = dateRange[0]
               const endDate = dateRange[1]

               // Check conditions for filtering
               if (!startDate && !endDate) {
                  // If no startDate and no endDate are provided, include all records.
                  return true;
               } else if (startDate && !endDate) {
                  // If only startDate is provided, filter for dates greater than or equal to startDate.
                  return rowDate >= startDate;
               } else if (!startDate && endDate) {
                  // If only endDate is provided, filter for dates less than or equal to endDate.
                  return rowDate <= endDate;
               } else {
                  // If both startDate and endDate are provided, filter for dates within the specified range.
                  return rowDate >= startDate && rowDate <= endDate;
               }
            })
         })
      }
   }

   if (globalFilter) {
      dbData = dbData.filter((row) =>
         Object.keys(row).some((columnId) =>
            row[columnId]
               ?.toString()
               ?.toLowerCase()
               ?.includes(globalFilter.toLowerCase())
         )
      );
   }

   const parsedSorting = JSON.parse(sorting);

   if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
         if (desc) {
            return a[id] < b[id] ? 1 : -1;
         }
         return a[id] > b[id] ? 1 : -1;
      });
   }

   const startIdx = parseInt(start);
   const endIdx = startIdx + parseInt(size);

   res.status(200).json({
      data: dbData.slice(startIdx, endIdx),
      meta: { totalRowCount: dbData.length },
   });
};

const updateagendasrmasuk = async (req, res) => {

   try {
      await productServices.updateAgendaSRMasuk(req.body);
      console.log("agenda surat rahasia masuk updated")
      res.status(200).send("Agenda surat rahasia masuk berhasil diupdate.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error updating agenda surat rahasia masuk.");
   }
}

const deleteagendasrmasuk = async (req, res) => {
   try {
      await productServices.deleteAgendaSRMasuk(req.query.no_agenda);
      console.log("agenda surat rahasia masuk deleted")
      res.status(200).send("Agenda surat rahasia masuk berhasil dihapus.");
   } catch (error) {
      console.log(error);
   }
}
// [finish] Agenda Rahasia Masuk -------------------------------------------------


// [start] Agenda Rahasia Keluar -------------------------------------------------

const insertagendasrkeluar = async (req, res) => {

   console.log("req body in insertagendasrkeluar", req.body)

   try {
      await productServices.insertAgendaSRKeluar(req.body);
      console.log("agenda surat rahasia keluar inserted")
      res.status(200).send("Agenda surat rahasia keluar berhasil ditambahkan.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error inserting agenda surat rahasia keluar.");
   }
}

const dataagendasrkeluar = async (req, res) => {
   let dbData = await productServices.getAgendaSRKeluar();

   console.log("req query in dataagendasrkeluar", req.query)

   const { start, size, filters, sorting, globalFilter } = req.query;

   const parsedColumnFilters = JSON.parse(filters);

   if (parsedColumnFilters?.length) {
      const dateFilters = parsedColumnFilters.filter((item) => item.id.includes('tgl'));
      const otherFilters = parsedColumnFilters.filter((item) => !item.id.includes('tgl'))

      // // Apply other filters
      otherFilters.forEach((filter) => {
         const { id: columnId, value: filterValue } = filter;
         dbData = dbData.filter((row) => {
            return (
               row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ?? false
            );
         });
      });
      // // Apply date range filter

      if (dateFilters) {

         dateFilters.forEach((filter) => {
            const { id: columnId, value: dateRange } = filter;

            dbData = dbData.filter((row) => {
               const rowDate = row[columnId]
               const startDate = dateRange[0]
               const endDate = dateRange[1]

               // Check conditions for filtering
               if (!startDate && !endDate) {
                  // If no startDate and no endDate are provided, include all records.
                  return true;
               } else if (startDate && !endDate) {
                  // If only startDate is provided, filter for dates greater than or equal to startDate.
                  return rowDate >= startDate;
               } else if (!startDate && endDate) {
                  // If only endDate is provided, filter for dates less than or equal to endDate.
                  return rowDate <= endDate;
               } else {
                  // If both startDate and endDate are provided, filter for dates within the specified range.
                  return rowDate >= startDate && rowDate <= endDate;
               }
            })
         })
      }
   }

   if (globalFilter) {
      dbData = dbData.filter((row) =>
         Object.keys(row).some((columnId) =>
            row[columnId]
               ?.toString()
               ?.toLowerCase()
               ?.includes(globalFilter.toLowerCase())
         )
      );
   }

   const parsedSorting = JSON.parse(sorting);

   if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
         if (desc) {
            return a[id] < b[id] ? 1 : -1;
         }
         return a[id] > b[id] ? 1 : -1;
      });
   }

   const startIdx = parseInt(start);
   const endIdx = startIdx + parseInt(size);

   res.status(200).json({
      data: dbData.slice(startIdx, endIdx),
      meta: { totalRowCount: dbData.length },
   });
};

const updateagendasrkeluar = async (req, res) => {

   try {
      await productServices.updateAgendaSRKeluar(req.body);
      console.log("agenda surat rahasia keluar updated")
      res.status(200).send("Agenda surat rahasia keluar berhasil diupdate.");
   } catch (error) {
      console.log(error);
      res.status(500).send("Error updating agenda surat rahasia keluar.");
   }
}

const deleteagendasrkeluar = async (req, res) => {
   try {
      await productServices.deleteAgendaSRKeluar(req.query.no_agenda);
      console.log("agenda surat rahasia keluar deleted")
      res.status(200).send("Agenda surat rahasia keluar berhasil dihapus.");
   } catch (error) {
      console.log(error);
   }
}
// [finish] Agenda Rahasia Keluar -------------------------------------------------












const apidata = async (req, res) => {
   let dbData = productServices.getData();

   const { start, size, filters, sorting, globalFilter } = req.query;

   const parsedColumnFilters = JSON.parse(filters);
   if (parsedColumnFilters?.length) {
      parsedColumnFilters.map((filter) => {
         const { id: columnId, value: filterValue } = filter;
         dbData = dbData.filter((row) => {
            return (
               row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ?? false
            );
         });
      });
   }

   if (globalFilter) {
      dbData = dbData.filter((row) =>
         Object.keys(row).some((columnId) =>
            row[columnId]
               ?.toString()
               ?.toLowerCase()
               ?.includes(globalFilter.toLowerCase())
         )
      );
   }

   const parsedSorting = JSON.parse(sorting);
   if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
         if (desc) {
            return a[id] < b[id] ? 1 : -1;
         }
         return a[id] > b[id] ? 1 : -1;
      });
   }

   const startIdx = parseInt(start);
   const endIdx = startIdx + parseInt(size);

   res.status(200).json({
      data: dbData.slice(startIdx, endIdx),
      meta: { totalRowCount: dbData.length },
   });
};


module.exports = {
   handleFileSent,
   uploadFile,
   downloadFile,
   apidata,
   alamatsurateksternal,
   alamatsuratinternal,
   derajat,
   sarkom,
   sistem,
   petugas,

   allalamatsurateksternal,
   insertalamatsurateksternal,

   insertagendasrmasuk,
   dataagendasrmasuk,
   updateagendasrmasuk,
   deleteagendasrmasuk,

   insertagendasrkeluar,
   dataagendasrkeluar,
   updateagendasrkeluar,
   deleteagendasrkeluar,

   insertagendasbmasuk,
   dataagendasbmasuk,
   updateagendasbmasuk,
   deleteagendasbmasuk,

   insertagendasbkeluar,
   dataagendasbkeluar,
   updateagendasbkeluar,
   deleteagendasbkeluar,
}
