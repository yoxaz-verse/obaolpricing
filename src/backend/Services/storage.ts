import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../database";



export const uploadImage = async (file: File, filePath: string) => {
  try {

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return {
      data: url,
      status: true
    }
  } catch (e) {
    console.log(e);
    return {
      data: null,
      status: false
    }
  }
}
export const deleteImage = async (filePath: string) => {
  try {
    console.log(filePath);
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return {
      status: true
    }
  } catch (e) {
    console.log(e);
    return {
      status: false
    }
  }
}

export const multipleUpload = async (files: FileList, filePath: string) => {
  try {
    let urls: any = [];

    await Promise.all(Array.from(files).map(async (file: File, index: number) => {
      let updatedFileName = `${filePath}_${index}`
      let url = await uploadImage(file, updatedFileName);
      urls.push(url.data);
    }));

    console.log(urls);

    return {
      data: urls,
      status: true
    };
  } catch (e) {
    console.error('Error uploading files:', e);
    return {
      data: null,
      status: false
    };
  }
};



