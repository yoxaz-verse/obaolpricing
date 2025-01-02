"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Spacer,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import { BulkAddProps } from "@/data/interface-data";
import { postData } from "@/backend/Services/firestore";

// Helper function to convert DD-MM-YYYY to ISO format
const convertToIsoFromString = (dateString: string): string => {
  if (!dateString) return ""; // Return empty string if dateString is invalid
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regex to match "DD-MM-YYYY" format
  if (!dateRegex.test(dateString)) {
    console.error(`Invalid date format: ${dateString}`);
    return ""; // Log error and return empty for invalid date
  }
  const [day, month, year] = dateString.split("-").map(Number); // Extract day, month, year
  const date = new Date(year, month - 1, day); // Create Date object
  return date.toISOString(); // Convert to ISO format
};

// Helper function to convert Unix timestamp to ISO format
const convertToDate = (timestamp: number): string => {
  if (!timestamp) return ""; // Return empty string if timestamp is invalid
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date
  return date.toISOString(); // Convert to ISO format
};

const BulkAdd: React.FC<BulkAddProps> = ({
  apiEndpoint,
  refetchData,
  currentTable,
}) => {
  const [file, setFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  // Handle file parsing and upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (typeof data === "string" || data instanceof ArrayBuffer) {
        try {
          let jsonData;

          if (file.type === "text/csv") {
            // Parse CSV file
            const csvString =
              typeof data === "string" ? data : new TextDecoder().decode(data);
            const workbook = XLSX.read(csvString, { type: "string" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
          } else {
            // Parse Excel file
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
          }

          // Process and format date fields
          jsonData = jsonData.map((item: any) => {
            // Handle assignmentDate
            if (
              item.assignmentDate &&
              typeof item.assignmentDate === "string"
            ) {
              if (/^\d{2}-\d{2}-\d{4}$/.test(item.assignmentDate)) {
                item.assignmentDate = convertToIsoFromString(
                  item.assignmentDate
                );
              } else if (/^\d+$/.test(item.assignmentDate)) {
                item.assignmentDate = convertToDate(
                  Number(item.assignmentDate)
                );
              }
            }

            // Handle schedaRadioDate
            if (
              item.schedaRadioDate &&
              typeof item.schedaRadioDate === "string"
            ) {
              if (/^\d{2}-\d{2}-\d{4}$/.test(item.schedaRadioDate)) {
                item.schedaRadioDate = convertToIsoFromString(
                  item.schedaRadioDate
                );
              } else if (/^\d+$/.test(item.schedaRadioDate)) {
                item.schedaRadioDate = convertToDate(
                  Number(item.schedaRadioDate)
                );
              }
            }

            return item; // Return the formatted item
          });

          console.log("Final Data Sent to Backend:", jsonData); // Debug final data

          // Send data to the backend
          await postData(apiEndpoint, jsonData);
          alert("Data uploaded successfully!");
          setFile(null); // Reset file input
          refetchData(); // Refresh table data
        } catch (error) {
          console.error("Error parsing the file:", error);
          alert(
            "Failed to process the file. Please check the format and try again."
          );
        }
      }
    };

    reader.readAsBinaryString(file); // Read the file as binary string
  };

  return (
    <div className="justify-between items-center w-max">
      <Accordion variant="splitted">
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title={`Bulk Add ${currentTable}`}
        >
          <Spacer y={1} />
          <Input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="w-[250px]"
          />
          <Spacer y={1} />
          <Button onClick={handleUpload} disabled={!file}>
            Process & Upload File
          </Button>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BulkAdd;
