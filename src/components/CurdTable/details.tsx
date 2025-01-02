"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FiEye } from "react-icons/fi";
import Image from "next/image";
import { DetailsModalProps } from "@/data/interface-data";


export default function DetailsModal({
  data,
  columns = [],
}: DetailsModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // List of fields you want to exclude from being displayed
  const excludeFields = [
    "password",
    "__v",
    "_id",
    "isDeleted",
    "isActive",
    "fileURL",
    "fileId",
  ];

  // Helper function to capitalize and space out camelCase or snake_case field names
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .toUpperCase();
  };

  // State to track if fallback image has been used
  const [isFallback, setIsFallback] = useState(false);

  // Helper function to format the value based on the column type
  // Helper function to format the value based on the column type
  const formatValue = (key: string, value: any) => {
    const column = columns.find((col) => col.uid === key);
    const type = column?.type;

    switch (type) {
      case "date":
        if (value) {
          const date = new Date(value);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        return "N/A";

      case "time":
        if (value) {
          const time = new Date(value);
          return time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Ensures 12-hour format (AM/PM)
          });
        }
        return "N/A";

      case "dateTime":
        if (value) {
          const dateTime = new Date(value);
          const dateFormatted = dateTime.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          const timeFormatted = dateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          // Combine date and time
          return `${dateFormatted} ${timeFormatted}`;
        }
        return "N/A";

      case "number":
        if (value !== undefined && value !== null) {
          return value.toLocaleString(); // Format numbers with commas
        }
        return "N/A";

      case "image":
        if (value) {
          return (
            <Image
              src={value}
              alt="Image"
              width={300}
              height={300}
              style={{ objectFit: "cover" }}
              onError={() => setIsFallback(true)}
            />
          );
        }
        return (
          <Image
            src="/fallback.jpg"
            alt="Fallback Image"
            width={300}
            height={300}
          />
        );

      case "text":
        return value || "N/A"; // Text field, return the value as-is

      case "select":
        return value ? value : "N/A"; // Select field, return the value or "N/A"

      case "multiselect":
        // return value && Array.isArray(value) ? value.join(", ") : "N/A"; // Multiselect, join array items as a comma-separated string
        return "N/A"; // Multiselect, join array items as a comma-separated string

      case "file":
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        ) : (
          "No File"
        ); // File type, provide download link

      case "textarea":
        return value || "N/A"; // Textarea field, return the value or "N/A"

      case "boolean":
        return value ? "Yes" : "No"; // Boolean field, return Yes/No

      case "action":
        return value || "N/A"; // Action field, just return the value

      case "email":
        return value ? <a href={`mailto:${value}`}>{value}</a> : "No Email"; // Email type, return mailto link

      case "password":
        return "********"; // Password field, always return a masked string

      default:
        return value || "N/A"; // Return the value or N/A if undefined
    }
  };

  return (
    <>
      <FiEye onClick={onOpen} className="cursor-pointer hover:text-green-600" />
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Details
              </ModalHeader>
              <ModalBody className="space-y-4">
                {/* Display User Details */}
                {Object.keys(data).map((key) => {
                  // Skip rendering excluded fields
                  if (excludeFields.includes(key)) return null;

                  // Handle nested objects (display them as JSON)
                  if (typeof data[key] === "object" && data[key] !== null) {
                    return (
                      <div key={key}>
                        <strong>{formatLabel(key)}:</strong>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(data[key], null, 2)}
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <p key={key}>
                      <strong>{formatLabel(key)}:</strong>{" "}
                      {formatValue(key, data[key])}
                    </p>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
