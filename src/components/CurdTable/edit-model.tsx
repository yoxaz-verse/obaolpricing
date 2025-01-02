"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
  ModalBody,
  Chip,
  Button,
  ModalFooter,
  DatePicker,
  Switch,
  TimeInput,
  Spinner,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/provider";
import { showToastMessage } from "@/utils/utils";
import { Key } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import Image from "next/image";
import { TbEdit } from "react-icons/tb";
import { parseDate, toCalendarDate } from "@internationalized/date";
import { EditModalProps, FormField } from "@/data/interface-data";
import { getData, getDatById, updateData } from "@/backend/Services/firestore";

const EditModal: React.FC<EditModalProps> = ({
  _id,
  currentTable,
  formFields,
  apiEndpoint,
  refetchData,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const uppyRef = useRef<Uppy | null>(null);

  // Fetch admin data when currentTable is 'manager'
  const {
    data: fetchedData,
    // isLoading: isAdminLoading,
    // isError: isAdminError,
  } = useQuery({
    queryKey: [apiEndpoint, _id],
    queryFn: () => getDatById(`${apiEndpoint}`, _id),
    enabled: open,
    refetchOnWindowFocus: false,
  });

  // Helper function to construct image URLs from file IDs
  const getImageUrl = (fileID: string): string => {
    // Define your base URL or uploads path
    const baseUploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL || "/uploads/";
    // Ensure that the baseUploadsUrl ends with a slash
    return `${baseUploadsUrl}${fileID}`;
  };

  // Initialize Uppy instance
  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1, // Adjust as needed
        allowedFileTypes: ["image/*", "application/pdf"], // Example: images and PDFs
        maxFileSize: 10 * 1024 * 1024, // 10 MB
      },
      autoProceed: false,
      allowMultipleUploads: false,
      debug: false, // Set to true for debugging
    });

    uppyInstance.use(XHRUpload, {
      endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/upload`, // Ensure NEXT_PUBLIC_BASE_URL is set in .env
      fieldName: "file", // Must match backend's expected field name
      formData: true,
      method: "POST",
      bundle: false, // Send files individually
      withCredentials: true,
      headers: {
        // Add any required headers here, e.g., authorization tokens
        // Authorization: `Bearer ${yourToken}`,
      },
    });

    uppyRef.current = uppyInstance;

    return () => {
      uppyInstance; // Properly clean up the Uppy instance
    };
  }, [apiEndpoint]);

  // Initialize formData with initialData
  useEffect(() => {
    if (!fetchedData) return;

    const initialData = fetchedData.data;
    console.log(initialData);

    const updatedFormData: Record<string, any> = { ...initialData };

    if (!initialData) return; // Corrected logic to exit if no data is available

    formFields.forEach((field: any) => {
      const fieldValue = initialData[field.key]; // Access field value

      // Skip specific fields like "password"
      if (field.key === "password") return;

      if (
        field.type === "select" &&
        fieldValue &&
        typeof fieldValue === "object"
      ) {
        // Handle select type (expecting an object with an 'id' property)
        updatedFormData[field.key] =
          (fieldValue as { id: string }).id || fieldValue;
      } else if (
        field.type === "multiselect" &&
        Array.isArray(fieldValue) &&
        fieldValue.every(
          (item: any) => typeof item === "object" && "id" in item
        )
      ) {
        // Handle multiselect type (expecting an array of objects with 'id' properties)
        updatedFormData[field.key] = fieldValue.map(
          (item: any) => (item as { id: string }).id || item
        );
      } else {
        // Fallback for other field types
        updatedFormData[field.key] = fieldValue;
      }
    });
    console.log(updatedFormData);

    setFormData(updatedFormData);
  }, [fetchedData, formFields]);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setFormData({});
    if (uppyRef.current) {
      uppyRef.current.destroy();
    }
  };

  // Mutation to handle data update
  const editItem = useMutation({
    mutationFn: async (data: any) => updateData(data, `${apiEndpoint}`, _id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [currentTable, apiEndpoint],
      });

      showToastMessage({
        type: "success",
        message: `${capitalize(currentTable)} Updated Successfully`,
        position: "top-right",
      });
      closeModal();
      setLoading(false);
    },
    onError: (error: any) => {
      showToastMessage({
        type: "error",
        message: error.response?.data?.message || "An error occurred",
        position: "top-right",
      });
      setLoading(false);
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    try {
      // const hasFileInput = formFields.some(
      //   (field) => field.type === "file" || field.type === "image"
      // );

      // let fileId: string | null = null;
      // let fileURL: string | null = null;

      // if (
      //   hasFileInput &&
      //   uppyRef.current &&
      //   uppyRef.current.getFiles().length > 0
      // ) {
      //   // Define the entities array based on the current form context
      //   const entities = [
      //     { entity: "projects", entityId: "projectId123" }, // Replace with actual IDs or pass as props
      //     { entity: "activities", entityId: "activityId456" },
      //     { entity: "timesheets", entityId: "timesheetId789" },
      //   ];

      //   // Attach form data as meta data, including the entities array
      //   uppyRef.current.setMeta({
      //     ...formData,
      //     entities: JSON.stringify(entities), // Serialize the array
      //   });

      //   // Initiate the upload
      //   const uploadResult = await uppyRef.current.upload();
      //   console.log("Uppy upload result:", uploadResult);

      //   if (uploadResult?.failed && uploadResult.failed.length > 0) {
      //     // Handle upload failures
      //     showToastMessage({
      //       type: "error",
      //       message: "File upload failed",
      //       position: "top-right",
      //     });
      //     setLoading(false);
      //     return;
      //   }

      //   // Extract the file ID and construct the file URL
      //   const uploadedFile =
      //     uploadResult?.successful && uploadResult.successful[0];

      //   if (
      //     uploadedFile &&
      //     uploadedFile.response &&
      //     uploadedFile.response.body
      //   ) {
      //     const responseBody = uploadedFile.response.body as any;
      //     fileId = responseBody.fileIds[0];
      //     fileURL = responseBody.fileURLs[0]
      //       ? responseBody.fileURLs[0]
      //       : getImageUrl(responseBody.fileIds[0]); // Fallback to constructed URL
      //   }

      //   if (!fileId || !fileURL) {
      //     // Handle missing fileId or fileURL
      //     showToastMessage({
      //       type: "error",
      //       message: "Failed to retrieve uploaded file details",
      //       position: "top-right",
      //     });
      //     setLoading(false);
      //     return;
      //   }
      // }

      // // Prepare the complete form data
      const completeFormData = {
        ...formData,
        // fileId: fileId || fetchedData?.data.fileId, // Preserve existing fileId if no new file uploaded
        // fileURL: fileURL || fetchedData?.data.fileURL, // Preserve existing fileURL if no new file uploaded
      };

      // Proceed with form submission
      editItem.mutate(completeFormData);
    } catch (error: any) {
      console.error("Submission error:", error);
      showToastMessage({
        type: "error",
        message: "An error occurred during submission",
        position: "top-right",
      });
      setLoading(false);
    }
  };

  // Handle input changes for text fields
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle selection changes for select and multiselect fields
  const handleSelectionChange = (fieldKey: string, value: Set<Key>) => {
    const valueArray = Array.from(value).map(String);
    setFormData((prevData) => ({
      ...prevData,
      [fieldKey]: valueArray,
    }));
  };

  // Handle chip removal for multiselect fields
  const handleChipClose = (itemToRemove: string, fieldKey: string) => {
    const updatedItems = formData[fieldKey].filter(
      (item: string) => item !== itemToRemove
    );
    setFormData((prevData) => ({
      ...prevData,
      [fieldKey]: updatedItems,
    }));
  };

  // Helper function to capitalize strings
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Helper function to render form fields based on type
  const handleDateChange = (key: string, date: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: date, // Store as ISO string for compatibility
    }));
  };
  const handleBooleanChange = (key: string, checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: checked,
    }));
  };

  const handleTimeChange = (key: string, time: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: time,
    }));
  };

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "date":
        const parsedDate = formData[field.key]
          ? parseDate(new Date(formData[field.key]).toISOString().split("T")[0])
          : undefined;

        return (
          <DatePicker
            name={field.key}
            labelPlacement="outside"
            label={field.label}
            className="max-w-[284px]"
            value={parsedDate} // Use `value` instead of `defaultValue`
            onChange={(date) =>
              handleDateChange(
                field.key,
                date.toString() // Convert DatePicker value to ISO string or another standard format
              )
            }
          />
        );

      case "boolean":
        return (
          <Switch
            name={field.key}
            // defaultSelected={formData[field.key] || false}
            onChange={(e) => handleBooleanChange(field.key, e.target.checked)} // Use handleBooleanChange
          >
            {field.label}
          </Switch>
        );
      case "time":
        const parsedTime =
          formData[field.key] &&
          new Date(formData[field.key]).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }); // e.g., "14:30" for 24-hour format

        return (
          <TimeInput
            name={field.key}
            label={field.label}
            hourCycle={24} // Use 24-hour format
            value={parsedTime || ""} // Pass time in "HH:mm" format
            onChange={(time) => handleTimeChange(field.key, time)} // Handle updates
          />
        );
      case "textarea":
        return (
          <textarea
            name={field.key}
            placeholder={field.label}
            className="py-2 border rounded-md w-full"
            value={formData[field.key] || ""}
            onChange={handleInputChange}
          />
        );

      case "select":
        if (field.values && field.values.length > 0)
          return (
            <Select
              name={field.key}
              label={`Select ${field.label}`}
              placeholder={field.label}
              className="py-2 border rounded-md w-full"
              selectedKeys={
                formData[field.key]
                  ? new Set([String(formData[field.key])])
                  : new Set()
              }
              onSelectionChange={(keys) =>
                handleInputChange({
                  target: {
                    name: field.key,
                    value: String(Array.from(keys)[0]),
                  },
                })
              }
            >
              {field.values.map((option: any) => (
                <SelectItem key={String(option.key)} value={String(option.key)}>
                  {option.value}
                </SelectItem>
              ))}
            </Select>
          );

      case "multiselect":
        if (field.values && field.values.length > 0)
          return (
            <>
              <Select
                name={field.key}
                label={`Select Multiple ${field.label}`}
                placeholder={field.label}
                className="py-2 border rounded-md w-full"
                selectionMode="multiple"
                selectedKeys={
                  formData[field.key] ? new Set(formData[field.key]) : new Set()
                }
                onSelectionChange={(keys) =>
                  handleSelectionChange(field.key, keys as Set<Key>)
                }
              >
                {field.values.map((option: any) => (
                  <SelectItem
                    key={String(option.key)}
                    value={String(option.key)}
                  >
                    {option.value}
                  </SelectItem>
                ))}
              </Select>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(formData[field.key] || []).map(
                  (item: string, index: number) => (
                    <Chip
                      key={index}
                      onClose={() => handleChipClose(item, field.key)}
                      variant="flat"
                    >
                      {field.values?.find((option: any) => option.key === item)
                        ?.value || item}
                    </Chip>
                  )
                )}
              </div>
            </>
          );

      case "file":
      case "image":
        return (
          <div>
            <label className="block mb-2">{field.label}</label>
            {uppyRef.current && (
              <Dashboard
                uppy={uppyRef.current}
                hideUploadButton
                proudlyDisplayPoweredByUppy={false}
                note="Only image and document files are allowed."
              />
            )}
            {/* Display existing image or file */}
            {formData[field.key] && (
              <div className="mt-4 flex justify-center">
                {typeof formData[field.key] === "string" &&
                (formData[field.key].endsWith(".pdf") ||
                  formData[field.key].endsWith(".PDF")) ? (
                  <a
                    href={formData[field.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View PDF
                  </a>
                ) : typeof formData[field.key] === "string" ? (
                  <Image
                    src={getImageUrl(formData[field.key])} // Ensure getImageUrl returns a valid URL
                    alt={`${field.label} Preview`}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : null}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            name={field.key}
            type={field.type}
            placeholder={field.label}
            className="py-2"
            defaultValue={
              field.key !== "password" ? formData[field.key] || "" : ""
            }
            onChange={handleInputChange}
          />
        );
    }
  };

  return (
    <>
      {/* Edit Button */}
      <button
        className="flex items-center justify-center gap-2 w-[100px] bg-yellow-600 rounded-xl text-white h-[38px] text-sm"
        onClick={openModal}
      >
        Edit
        <TbEdit className="hover:text-yellow-300" />
      </button>

      {/* Edit Modal */}
      <Modal isOpen={open} onClose={closeModal} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit {capitalize(currentTable)}
          </ModalHeader>

          {fetchedData && formData != null ? (
            <ModalBody>
              <form onSubmit={handleSubmit}>
                {formFields
                  .filter((field) => field.inEdit)
                  .map((field, index) => (
                    <div key={index} className="mb-4">
                      {renderFormField(field)}
                    </div>
                  ))}
                <div className="flex justify-end w-full mt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-[100px]"
                    color="primary"
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
