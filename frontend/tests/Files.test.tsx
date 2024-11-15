import File from "../src/components/File";
import { describe, expect, it, vi, beforeAll, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import UpdateFile from "../src/components/UpdateFile";
import DeleteFile from "../src/components/DeleteFile";

let mockedData;

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  //   const mockedData = {
  //     data: [
  //       {
  //         id: 1,
  //         title: "test",
  //         ownerId: 1,
  //         createdAt: "Monday",
  //         updatedAt: null,
  //         size: "1.00 MB",
  //         uploadTime: 0.01,
  //         folderId: 1,
  //       },
  //     ],
  //   };

  return {
    _esModule: true,
    ...originalModule,
    useNavigate: vi.fn(),
    useOutletContext: () => mockedData,
    Link: "a",
  };
});

beforeEach(() => {
  mockedData = {
    files: {
      data: [],
    },
  };
});

// No support for dialog in js-dom
beforeAll(() => {
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("Files", () => {
  it("Renders no files", () => {
    render(<File />);

    expect(screen.getByText("No files")).toBeInTheDocument();
  });

  it("Renders file title", () => {
    mockedData = {
      files: {
        data: [
          {
            id: 1,
            title: "test file 1",
            ownerId: 1,
            createdAt: "Monday",
            updatedAt: null,
            size: "1.00 MB",
            uploadTime: 0.01,
            folderId: 1,
          },
        ],
      },
      folders: {
        folders: [
          { id: 1, title: "main", userId: 1 },
          { id: 2, title: "second", userId: 1 },
        ],
      },
    };

    render(<File />);

    expect(screen.getByText("test file 1")).toBeInTheDocument();
  });

  it("Renders file details", async () => {
    const user = userEvent.setup();

    mockedData = {
      files: {
        data: [
          {
            id: 1,
            title: "test file 1",
            ownerId: 1,
            createdAt: "Monday",
            updatedAt: null,
            size: "1.00 MB",
            uploadTime: 0.01,
            folderId: 1,
          },
        ],
      },
      folders: {
        folders: [
          { id: 1, title: "main", userId: 1 },
          { id: 2, title: "second", userId: 1 },
        ],
      },
    };

    render(<File />);

    const detailsButton = screen.getByRole("button", { name: "Show details" });
    await user.click(detailsButton);

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("1.00 MB")).toBeInTheDocument();
    expect(screen.getByText("0.01 seconds")).toBeInTheDocument();
  });

  it("Renders file name + folder list in update component", async () => {
    const user = userEvent.setup();

    mockedData = {
      files: {
        data: [
          {
            id: 1,
            title: "test file 1",
            ownerId: 1,
            createdAt: "Monday",
            updatedAt: null,
            size: "1.00 MB",
            uploadTime: 0.01,
            folderId: 1,
          },
        ],
      },
      folders: {
        folders: [
          { id: 1, title: "main", userId: 1 },
          { id: 2, title: "second", userId: 1 },
        ],
      },
    };

    render(
      <UpdateFile
        getFolder={vi.fn()}
        currentFolder="main"
        fileId={1}
        currentFilename="test file 1"
      />
    );

    const updateButton = screen.getByRole("button", { name: "···" });
    await user.click(updateButton);

    expect(screen.getByDisplayValue("test file 1")).toHaveAttribute(
      "id",
      "fileName"
    );
    expect(screen.getByDisplayValue("main")).toHaveAttribute("id", "folder");
    // It can't find the option elements within a dialog so searching by text
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  it("Renders file title to be deleted", async () => {
    const user = userEvent.setup();

    mockedData = {
      files: {
        data: [
          {
            id: 1,
            title: "test file 1",
            ownerId: 1,
            createdAt: "Monday",
            updatedAt: null,
            size: "1.00 MB",
            uploadTime: 0.01,
            folderId: 1,
          },
        ],
      },
      folders: {
        folders: [
          { id: 1, title: "main", userId: 1 },
          { id: 2, title: "second", userId: 1 },
        ],
      },
    };

    render(
      <DeleteFile
        getFolder={vi.fn()}
        currentFolder="main"
        fileId={1}
        fileTitle="test file 1"
      />
    );

    const deleteButton = screen.getByRole("button", { name: "Delete file" });
    await user.click(deleteButton);

    expect(
      screen.getByText("Yes, delete file test file 1")
    ).toBeInTheDocument();
  });
});
