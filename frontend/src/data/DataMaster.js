import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAlamatSuratEksternal = () => {
   return useQuery(["alamat_surat_eksternal-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/alamatsurateksternal`;
      const response = await axios.get(apiUrl);
      return response.data;
   });
}

export const useAlamatSuratInternal = () => {
   return useQuery(["alamat_surat_internal-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/alamatsuratinternal`;
      const response = await axios.get(apiUrl);
      return response.data;
   });
}

export const useDerajat = () => {
   return useQuery(["derajat-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/derajat`;
      const response = await axios.get(apiUrl);
      return response.data;
   }, {
      keepPreviousData: true,
   });
}

export const useSarkom = () => {
   return useQuery(["sarkom-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/sarkom`;
      const response = await axios.get(apiUrl);
      return response.data;
   }, {
      keepPreviousData: true,
   });
}

export const useSistem = () => {
   return useQuery(["sistem-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/sistem`;
      const response = await axios.get(apiUrl);
      return response.data;
   }, {
      keepPreviousData: true,
   });
}

export const usePetugas = () => {
   return useQuery(["petugas-data"], async () => {
      const apiUrl = `${import.meta.env.VITE_SERVER_LINK}/data/petugas`;
      const response = await axios.get(apiUrl);
      return response.data;
   }, {
      keepPreviousData: true,
   });
}

