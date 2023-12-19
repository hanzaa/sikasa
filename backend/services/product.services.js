const db = require("../configs/db.config");

const getAlamatSuratEksternal = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM alamat_surat_eksternal
            `
        )
        const alamat_eksternal = data.rows.map(item => item.alamat_eksternal)

        return alamat_eksternal

    } catch (error) {
        throw error
    }

}

const getAlamatSuratInternal = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM alamat_surat_internal
            `
        )
        const alamat_internal = data.rows.map(item => item.alamat_internal)

        return alamat_internal

    } catch (error) {
        throw error
    }

}
const getDerajat = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM derajat
            `
        )
        const derajat = data.rows.map(item => item.derajat)

        return derajat

    } catch (error) {
        throw error
    }

}

const getSarkom = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM sarkom
            `
        )
        const sarkom = data.rows.map(item => item.sarkom)

        return sarkom

    } catch (error) {
        throw error
    }

}
const getSistem = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM sistem
            `
        )
        const sistem = data.rows.map(item => item.sistem)

        return sistem

    } catch (error) {
        throw error
    }

}

const getPetugas = async () => {

    try {

        const data = await db.query(
            `
            SELECT * FROM petugas
            `
        )
        const nama_petugas = data.rows.map(item => item.nama_petugas)

        return nama_petugas

    } catch (error) {
        throw error
    }

}

const insertFileMetadata = async (file_metadata) => {
    const values = [
        file_metadata.fileId, file_metadata.originalname, file_metadata.mimetype, file_metadata.encryptedAesKey, file_metadata.encryptedIv];
    const query =
        "INSERT INTO files_metadata (id_file_surat, nama_file_surat, mimetype, encrypted_aes_key, encrypted_iv) VALUES ($1, $2, $3, $4, $5)";

    try {
        await db.query(query, values);
    } catch (err) {
        console.error("Error:", err);
    }
}

//[start] alamat surat eksternal-------------------------------------------------------------------


const getAllAlamatSuratEksternal = async () => {

    try {

        const data = await db.query(
            `
            SELECT             
            "kd_alamat",
            "alamat_eksternal",
            TO_CHAR("tgl_tugas", 'YYYY-MM-DD') AS tgl_tugas, 
            TO_CHAR("jam_tugas", 'HH24:MI') AS jam_tugas
            FROM alamat_surat_eksternal
            `
        )

        return data.rows

    } catch (error) {
        throw error
    }

}

const insertAlamatSuratEksternal = async (data) => {
    console.log("data from req.body:", data)
    const query = `INSERT INTO "alamat_surat_eksternal" (
    "alamat_eksternal"
    ) VALUES ($1)`

    const values = [
        data.alamat_eksternal,
    ]
    console.log(values)

    try {
        await db .query(query, values);
    } catch (err) {
        console.error('Error:', err);
    }
}

const updateAlamatSuratEksternal = async (data) => {
    const updateFields = Object.keys(data).map((key, index) => {
        return `"${key}" = $${index + 1}`;
    });

    const updateValues = Object.values(data);

    const query =
        `
        UPDATE "alamat_surat_eksternal"
        SET ${updateFields.join(', ')}
        WHERE kd_alamat = $${updateFields.length + 1}
        `;

    try {
        const queryParams = [...Object.values(data), updateValues[0]];
        console.log("updateFields:", updateFields)
        console.log("updateValues:", updateValues)
        console.log("queryParams:", queryParams)
        console.log("query:", query)
        await db.query(query, queryParams);
    } catch (err) {
        throw err;
    }
}


//[finish] alamat surat eksternal-------------------------------------------------------------------



// [start] Agenda SB Masuk------------------------------------------------------------------
const getAgendaSBMasuk = async () => {
    try {
        const agenda = await db.query(
            `SELECT 
            "no_agenda",
            "no_surat",
            TO_CHAR("tgl_surat", 'YYYY-MM-DD') AS tgl_surat,
            "dari",
            "kepada",
            "tembusan",
            "jumlah_copy",
            "derajat",
            "sarkom",
            "jml_hal",
            "isi_berita",
            TO_CHAR("tgl_surat_diterima", 'YYYY-MM-DD') AS tgl_surat_diterima,
            TO_CHAR("jam_terima", 'HH24:MI') AS jam_terima,
            TO_CHAR("tgl_surat_dikirim", 'YYYY-MM-DD') AS tgl_surat_dikirim,
            TO_CHAR("jam_kirim", 'HH24:MI') AS jam_kirim,
            "id_file_surat",
            "nama_file_surat",
            "nama_petugas_1",
            "nama_petugas_2",
            TO_CHAR("tgl_tugas", 'YYYY-MM-DD') AS tgl_tugas,
            TO_CHAR("jam_tugas", 'HH24:MI') AS jam_tugas
            FROM "agenda_biasa_masuk" `
        )
        return agenda.rows
    } catch (err) {
        throw err
    }
}

const insertAgendaSBMasuk = async (data) => {
    console.log("data from req.body:", data)
    const query = `INSERT INTO "agenda_biasa_masuk" (
    "no_surat",
    "tgl_surat",
    "dari",
    "kepada",
    "tembusan",
    "jumlah_copy",
    "derajat",
    "sarkom",
    "jml_hal",
    "isi_berita",
    "tgl_surat_diterima",
    "jam_terima",
    "tgl_surat_dikirim",
    "jam_kirim",
    "id_file_surat",
    "nama_file_surat",
    "nama_petugas_1",
    "nama_petugas_2"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`

    const values = [
        data.no_surat,
        data.tgl_surat,
        data.dari,
        data.kepada,
        data.tembusan,
        data.jumlah_copy,
        data.derajat,
        data.sarkom,
        data.jml_hal,
        data.isi_berita,
        data.tgl_surat_diterima,
        data.jam_terima,
        data.tgl_surat_dikirim,
        data.jam_kirim,
        data.id_file_surat,
        data.nama_file_surat,
        data.nama_petugas_1,
        data.nama_petugas_2,
    ]

    try {
        await db.query(query, values);
    } catch (err) {
        console.error('Error:', err);
    }
}

const updateAgendaSBMasuk = async (data) => {
    const updateFields = Object.keys(data).map((key, index) => {
        return `"${key}" = $${index + 1}`;
    });

    const updateValues = Object.values(data);

    const query =
        `
        UPDATE "agenda_biasa_masuk"
        SET ${updateFields.join(', ')}
        WHERE no_agenda = $${updateFields.length + 1}
        `;

    try {
        const queryParams = [...Object.values(data), updateValues[0]];
        console.log("updateFields:", updateFields)
        console.log("updateValues:", updateValues)
        console.log("queryParams:", queryParams)
        console.log("query:", query)
        await db.query(query, queryParams);
    } catch (err) {
        throw err;
    }
}

const deleteAgendaSBMasuk = async (no_agenda) => {
    const query = `DELETE FROM "agenda_biasa_masuk" WHERE "no_agenda" = $1`
    const values = [no_agenda]
    try {
        await db.query(query, values);
    } catch (err) {
        throw err
    }
}
// [finish] Agenda SB Masuk------------------------------------------------------------------

// [start] Agenda SB Keluar------------------------------------------------------------------
const getAgendaSBKeluar = async () => {
    try {
        const agenda = await db.query(
            `SELECT 
            "no_agenda",
            "no_surat",
            TO_CHAR("tgl_surat", 'YYYY-MM-DD') AS tgl_surat,
            "dari",
            "kepada",
            "tembusan",
            "jumlah_copy",
            "derajat",
            "sarkom",
            "jml_hal",
            "isi_berita",
            TO_CHAR("tgl_surat_diterima", 'YYYY-MM-DD') AS tgl_surat_diterima,
            TO_CHAR("jam_terima", 'HH24:MI') AS jam_terima,
            TO_CHAR("tgl_surat_dikirim", 'YYYY-MM-DD') AS tgl_surat_dikirim,
            TO_CHAR("jam_kirim", 'HH24:MI') AS jam_kirim,
            "id_file_surat",
            "nama_file_surat",
            "nama_petugas_1",
            "nama_petugas_2",
            TO_CHAR("tgl_tugas", 'YYYY-MM-DD') AS tgl_tugas,
            TO_CHAR("jam_tugas", 'HH24:MI') AS jam_tugas
            FROM "agenda_biasa_keluar" `
        )
        return agenda.rows
    } catch (err) {
        throw err
    }
}

const insertAgendaSBKeluar = async (data) => {
    console.log("data from req.body:", data)
    const query = `INSERT INTO "agenda_biasa_keluar" (
    "no_surat",
    "tgl_surat",
    "dari",
    "kepada",
    "tembusan",
    "jumlah_copy",
    "derajat",
    "sarkom",
    "jml_hal",
    "isi_berita",
    "tgl_surat_diterima",
    "jam_terima",
    "tgl_surat_dikirim",
    "jam_kirim",
    "id_file_surat",
    "nama_file_surat",
    "nama_petugas_1",
    "nama_petugas_2"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`

    const values = [
        data.no_surat,
        data.tgl_surat,
        data.dari,
        data.kepada,
        data.tembusan,
        data.jumlah_copy,
        data.derajat,
        data.sarkom,
        data.jml_hal,
        data.isi_berita,
        data.tgl_surat_diterima,
        data.jam_terima,
        data.tgl_surat_dikirim,
        data.jam_kirim,
        data.id_file_surat,
        data.nama_file_surat,
        data.nama_petugas_1,
        data.nama_petugas_2,
    ]

    try {
        await db.query(query, values);
    } catch (err) {
        console.error('Error:', err);
    }
}

const updateAgendaSBKeluar = async (data) => {
    const updateFields = Object.keys(data).map((key, index) => {
        return `"${key}" = $${index + 1}`;
    });

    const updateValues = Object.values(data);

    const query =
        `
        UPDATE "agenda_biasa_keluar"
        SET ${updateFields.join(', ')}
        WHERE no_agenda = $${updateFields.length + 1}
        `;

    try {
        const queryParams = [...Object.values(data), updateValues[0]];
        console.log("updateFields:", updateFields)
        console.log("updateValues:", updateValues)
        console.log("queryParams:", queryParams)
        console.log("query:", query)
        await db.query(query, queryParams);
    } catch (err) {
        throw err;
    }
}

const deleteAgendaSBKeluar = async (no_agenda) => {
    const query = `DELETE FROM "agenda_biasa_keluar" WHERE "no_agenda" = $1`
    const values = [no_agenda]
    try {
        await db.query(query, values);
    } catch (err) {
        throw err
    }
}
// [finish] Agenda SB Keluar------------------------------------------------------------------



// [start] Agenda SR Masuk------------------------------------------------------------------
const getAgendaSRMasuk = async () => {
    try {
        const agenda = await db.query(
            `SELECT 
            "no_agenda",
            "no_surat",
            TO_CHAR("tgl_surat", 'YYYY-MM-DD') AS tgl_surat,
            "dari",
            "kepada",
            "tembusan",
            "jumlah_copy",
            "derajat",
            "sarkom",
            "sistem",
            "jml_hal",
            "isi_berita",
            TO_CHAR("tgl_surat_diterima", 'YYYY-MM-DD') AS tgl_surat_diterima,
            TO_CHAR("jam_terima", 'HH24:MI') AS jam_terima,
            TO_CHAR("tgl_surat_dikirim", 'YYYY-MM-DD') AS tgl_surat_dikirim,
            TO_CHAR("jam_kirim", 'HH24:MI') AS jam_kirim,
            "id_file_surat",
            "nama_file_surat",
            "nama_petugas_1",
            "nama_petugas_2",
            TO_CHAR("tgl_tugas", 'YYYY-MM-DD') AS tgl_tugas,
            TO_CHAR("jam_tugas", 'HH24:MI') AS jam_tugas
            FROM "agenda_rahasia_masuk" `
        )
        return agenda.rows
    } catch (err) {
        throw err
    }
}


const insertAgendaSRMasuk = async (data) => {
    console.log("data from req.body:", data)
    const query = `INSERT INTO "agenda_rahasia_masuk" (
    "no_surat",
    "tgl_surat",
    "dari",
    "kepada",
    "tembusan",
    "jumlah_copy",
    "derajat",
    "sarkom",
    "sistem",
    "jml_hal",
    "isi_berita",
    "tgl_surat_diterima",
    "jam_terima",
    "tgl_surat_dikirim",
    "jam_kirim",
    "id_file_surat",
    "nama_file_surat",
    "nama_petugas_1",
    "nama_petugas_2"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`

    const values = [
        data.no_surat,
        data.tgl_surat,
        data.dari,
        data.kepada,
        data.tembusan,
        data.jumlah_copy,
        data.derajat,
        data.sarkom,
        data.sistem,
        data.jml_hal,
        data.isi_berita,
        data.tgl_surat_diterima,
        data.jam_terima,
        data.tgl_surat_dikirim,
        data.jam_kirim,
        data.id_file_surat,
        data.nama_file_surat,
        data.nama_petugas_1,
        data.nama_petugas_2,
    ]

    try {
        await db.query(query, values);
    } catch (err) {
        console.error('Error:', err);
    }
}

const updateAgendaSRMasuk = async (data) => {
    const updateFields = Object.keys(data).map((key, index) => {
        return `"${key}" = $${index + 1}`;
    });

    const updateValues = Object.values(data);

    const query =
        `
        UPDATE "agenda_rahasia_masuk"
        SET ${updateFields.join(', ')}
        WHERE no_agenda = $${updateFields.length + 1}
        `;

    try {
        const queryParams = [...Object.values(data), updateValues[0]];
        console.log("updateFields:", updateFields)
        console.log("updateValues:", updateValues)
        console.log("queryParams:", queryParams)
        console.log("query:", query)
        await db.query(query, queryParams);
    } catch (err) {
        throw err;
    }
}

const deleteAgendaSRMasuk = async (no_agenda) => {
    const query = `DELETE FROM "agenda_rahasia_masuk" WHERE "no_agenda" = $1`
    const values = [no_agenda]
    try {
        await db.query(query, values);
    } catch (err) {
        throw err
    }
}
// [finish] Agenda SR Masuk------------------------------------------------------------------


// [start] Agenda SR Keluar------------------------------------------------------------------
const getAgendaSRKeluar = async () => {
    try {
        const agenda = await db.query(
            `SELECT 
            "no_agenda",
            "no_surat",
            TO_CHAR("tgl_surat", 'YYYY-MM-DD') AS tgl_surat,
            "dari",
            "kepada",
            "tembusan",
            "jumlah_copy",
            "derajat",
            "sarkom",
            "sistem",
            "jml_hal",
            "isi_berita",
            TO_CHAR("tgl_surat_diterima", 'YYYY-MM-DD') AS tgl_surat_diterima,
            TO_CHAR("jam_terima", 'HH24:MI') AS jam_terima,
            TO_CHAR("tgl_surat_dikirim", 'YYYY-MM-DD') AS tgl_surat_dikirim,
            TO_CHAR("jam_kirim", 'HH24:MI') AS jam_kirim,
            "id_file_surat",
            "nama_file_surat",
            "nama_petugas_1",
            "nama_petugas_2",
            TO_CHAR("tgl_tugas", 'YYYY-MM-DD') AS tgl_tugas,
            TO_CHAR("jam_tugas", 'HH24:MI') AS jam_tugas
            FROM "agenda_rahasia_keluar" `
        )
        return agenda.rows
    } catch (err) {
        throw err
    }
}

const insertAgendaSRKeluar = async (data) => {
    console.log("data from req.body:", data)
    const query = `INSERT INTO "agenda_rahasia_keluar" (
    "no_surat",
    "tgl_surat",
    "dari",
    "kepada",
    "tembusan",
    "jumlah_copy",
    "derajat",
    "sarkom",
    "sistem",
    "jml_hal",
    "isi_berita",
    "tgl_surat_diterima",
    "jam_terima",
    "tgl_surat_dikirim",
    "jam_kirim",
    "id_file_surat",
    "nama_file_surat",
    "nama_petugas_1",
    "nama_petugas_2"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`

    const values = [
        data.no_surat,
        data.tgl_surat,
        data.dari,
        data.kepada,
        data.tembusan,
        data.jumlah_copy,
        data.derajat,
        data.sarkom,
        data.sistem,
        data.jml_hal,
        data.isi_berita,
        data.tgl_surat_diterima,
        data.jam_terima,
        data.tgl_surat_dikirim,
        data.jam_kirim,
        data.id_file_surat,
        data.nama_file_surat,
        data.nama_petugas_1,
        data.nama_petugas_2,
    ]

    try {
        await db.query(query, values);
    } catch (err) {
        console.error('Error:', err);
    }
}

const updateAgendaSRKeluar = async (data) => {
    const updateFields = Object.keys(data).map((key, index) => {
        return `"${key}" = $${index + 1}`;
    });

    const updateValues = Object.values(data);

    const query =
        `
        UPDATE "agenda_rahasia_keluar"
        SET ${updateFields.join(', ')}
        WHERE no_agenda = $${updateFields.length + 1}
        `;

    try {
        const queryParams = [...Object.values(data), updateValues[0]];
        console.log("updateFields:", updateFields)
        console.log("updateValues:", updateValues)
        console.log("queryParams:", queryParams)
        console.log("query:", query)
        await db.query(query, queryParams);
    } catch (err) {
        throw err;
    }
}

const deleteAgendaSRKeluar = async (no_agenda) => {
    const query = `DELETE FROM "agenda_rahasia_keluar" WHERE "no_agenda" = $1`
    const values = [no_agenda]
    try {
        await db.query(query, values);
    } catch (err) {
        throw err
    }
}
// [finish] Agenda SR Keluar------------------------------------------------------------------



module.exports = {
    getAlamatSuratEksternal,
    getAlamatSuratInternal,
    getDerajat,
    getSarkom,
    getSistem,
    getPetugas,

    insertFileMetadata,

    getAllAlamatSuratEksternal,
    insertAlamatSuratEksternal,

    insertAgendaSRMasuk,
    getAgendaSRMasuk,
    updateAgendaSRMasuk,
    deleteAgendaSRMasuk,

    insertAgendaSRKeluar,
    getAgendaSRKeluar,
    updateAgendaSRKeluar,
    deleteAgendaSRKeluar,

    insertAgendaSBMasuk,
    getAgendaSBMasuk,
    updateAgendaSBMasuk,
    deleteAgendaSBMasuk,

    insertAgendaSBKeluar,
    getAgendaSBKeluar,
    updateAgendaSBKeluar,
    deleteAgendaSBKeluar,

}