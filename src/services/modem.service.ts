import axiosInstance from "../api/axiosInstance";

export type UploadExcelFileDto = {
  excelFile: File[];
};

export type Modem = {
  id: number;
  name: string;
  model: string;
  serial_number: string;
  supplier: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export const modemService = {
  uploadExcelFile: (data: UploadExcelFileDto) => {
    const formData = new FormData();
    if (data.excelFile) {
      formData.append("file", data.excelFile[0]);
    }
    return axiosInstance
      .post<{
        success: boolean;
        modems: Modem[];
      }>("/modems/upload", formData)
      .then((r) => r.data);
  },
};
