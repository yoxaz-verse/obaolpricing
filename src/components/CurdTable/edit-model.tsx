"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  Button,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/provider";
import { TbEdit } from "react-icons/tb";
import { EditModalProps, FormField } from "@/data/interface-data";
import { updateData } from "@/backend/Services/firestore";

const EditModal: React.FC<EditModalProps> = ({
  item,
  currentTable,
  formFields,
  apiEndpoint,
  refetchData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  /**
   * Handles modal state.
   */
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({});
  };

  /**
   * Populates `formData` when `item` and `formFields` change.
   */
  useEffect(() => {
    if (!item || typeof item !== "object") return;
    const initialData = item;
    if (typeof initialData === "object" && initialData !== null) {
      const updatedFormData: Record<string, any> = { ...initialData };
      setFormData(updatedFormData);
    } else {
      console.error("initialData is not an object or is null:", initialData);
    }

    // Populate fields dynamically
    formFields.forEach((field) => {
      initialData[field.key] = item[field.key] || "";
    });
    console.log(item);

    setFormData(initialData);
    setLoading(false);
    console.log(initialData);
  }, [item, formFields]);

  /**
   * Handles input changes dynamically.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles form submission to update the data.
   */
  const editItem = useMutation({
    mutationFn: async (data: any) => updateData(data, apiEndpoint, item.id),
    onSuccess: () => {
      console.log(formData);

      queryClient.invalidateQueries();
      refetchData?.();
      closeModal();
    },
    onError: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    editItem.mutate(formData);
  };

  /**
   * Renders form fields based on their type.
   */
  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <Input
            key={field.key}
            name={field.key}
            type={field.type}
            placeholder={field.label}
            value={formData[field.key] || ""}
            onChange={handleInputChange}
          />
        );
      // Add additional cases for custom field types if necessary
      default:
        return null;
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} size="lg">
        <ModalContent>
          <ModalHeader>Edit {currentTable}</ModalHeader>

          {item && loading ? (
            <Spinner />
          ) : (
            <ModalBody>
              <form onSubmit={handleSubmit}>
                {formFields
                  .filter((field) => field.inEdit)
                  .map((field) => (
                    <div key={field.key} className="mb-4">
                      {renderFormField(field)}
                    </div>
                  ))}

                <div className="flex justify-end mt-4">
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
          )}

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
