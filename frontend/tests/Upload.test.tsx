import { describe, expect, it, vi, beforeAll } from "vitest";
import userEvent from "@testing-library/user-event";
import { getByTestId, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import Upload from "../src/components/Upload";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const mockedData = {
    folders: {
      folders: [
        { id: 1, title: "main", userId: 1 },
        { id: 2, title: "second", userId: 1 },
      ],
    },
    setUploadFolder: vi.fn(),
    error: "Upload failed",
  };

  return {
    _esModule: true,
    ...originalModule,
    useNavigate: vi.fn(),
    useOutletContext: () => mockedData,
    Link: "a",
  };
});

describe("Upload", () => {
  it("Should render existing folders as selection", () => {
    const loading = false;
    render(<Upload props={{ loading }} />);

    const options = screen.getAllByRole("option");

    expect(screen.getByRole("option", { name: "main" }).selected).toBe(true);
    expect(options).toHaveLength(2);
  });
});
