// components/CommonTable.tsx

"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { baseUrl } from "@/core/api/axiosInstance";
import { TableProps } from "@/data/interface-data";

export default function CommonTable({
  TableData = [], // Default value as an empty array
  columns,
  viewModal,
  deleteModal,
  editModal,
  otherModal,
  isLoading = false,
  ...props
}: TableProps) {
  type UserData = (typeof TableData)[0];
  console.log(TableData);

  const renderCell = React.useCallback(
    (item: UserData, columnKey: React.Key) => {
      const column = (columns || []).find((col) => col.uid === columnKey); // Fallback to empty array
      if (!column) {
        return <span>Column not found</span>; // Handle case when column is not found
      }

      const cellValue = item[columnKey as keyof UserData];
      const columnType = column?.type;

      switch (columnType) {
        case "date":
          if (cellValue) {
            const date = new Date(cellValue);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long", // Ensures two-digit month
              day: "2-digit", // Ensures two-digit day
            });
          }
          return "N/A";

        case "time":
          if (cellValue) {
            const time = new Date(cellValue);
            // Format the time in 12-hour format (AM/PM)
            return time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, // Ensures 12-hour format (AM/PM)
            });
          }
          return "N/A";

        case "dateTime":
          if (cellValue) {
            const dateTime = new Date(cellValue);

            const dateFormatted = dateTime.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            const timeFormatted = dateTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            // Combine date and time
            return `${dateFormatted} ${timeFormatted}`;
          }
          return "N/A";

        case "file":
          if (cellValue) {
            const imageURL = item.fileURL || `${baseUrl}/${cellValue}`;
            return (
              <Image
                src={imageURL}
                alt={item.name}
                width={1000}
                height={1000}
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback.jpg";
                }}
              />
            );
          }
          return <span>No Image</span>;

        case "action":
          return (
            <div className="relative flex items-center gap-2">
              {viewModal && (
                <Tooltip content="View">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    {viewModal(item)}
                  </span>
                </Tooltip>
              )}
              {editModal && (
                <Tooltip content="Edit">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    {editModal(item)}
                  </span>
                </Tooltip>
              )}
              {otherModal && (
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  {otherModal(item)}
                </span>
              )}{" "}
              {deleteModal && (
                <Tooltip color="danger" content="Delete">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    {deleteModal(item)}
                  </span>
                </Tooltip>
              )}
            </div>
          );

        default:
          return cellValue || "N/A";
      }
    },
    [viewModal, deleteModal, editModal, columns, otherModal] // Ensure columns is included in the dependency array
  );

  // Pagination logic
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil((TableData?.length || 0) / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return TableData ? TableData.slice(start, end) : [];
  }, [page, TableData]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Table
      isStriped
      color={"warning"}
      aria-label="Table with custom actions"
      bottomContent={
        <div className="flex w-full justify-center">
          {/* <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          /> */}
        </div>
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions2" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody items={items}>
        {(item: any) => (
          <TableRow key={item._id}>
            {(columnKey) => {
              // Convert the `updatedAt` timestamp to a JavaScript Date object
              const isToday = (() => {
                if (item.updatedAt?.seconds) {
                  const updatedDate = new Date(
                    item.updatedAt.seconds * 1000
                  ).toDateString(); // Convert seconds to milliseconds
                  const today = new Date().toDateString(); // Get today's date
                  return updatedDate === today; // Compare dates
                }
                return false; // Default to false if updatedAt is invalid
              })();

              return (
                <TableCell
                  className={isToday ? "text-green-700" : "text-blue-700"}
                >
                  {renderCell(item, columnKey)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}