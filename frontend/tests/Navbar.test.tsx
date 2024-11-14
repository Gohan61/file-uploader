import Navbar from "../src/components/Navbar";
import {
  describe,
  expect,
  it,
  vi,
  vitest,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import userEvent from "@testing-library/user-event";
import fireEvent from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import React from "react";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const loginStatus = false;
  const setLoginStatus = () => {};

  return {
    _esModule: true,
    ...originalModule,
    useNavigate: vi.fn(),
    Link: "a",
  };
});

// beforeEach(() => {
//   vitest.spyOn(global, "fetch").mockResolvedValue({
//     json: vi.fn().mockResolvedValue(mockResponse),
//   });
// });

// afterEach(() => {
//   vi.restoreAllMocks();
// });

// No support for dialog in js-dom
beforeAll(() => {
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("Navbar", () => {
  it("Should only render signin-up for not logged in user", () => {
    const loading = false;
    const folders = { folders: [] };
    render(<Navbar props={{ loading, folders }} />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("Should not render signin-up for not logged in user", () => {
    const loading = false;
    const folders = { folders: [] };
    const loginStatus = true;
    render(<Navbar props={{ loading, folders, loginStatus }} />);

    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
  });

  it("Should render main folder without delete/update", () => {
    const loading = false;
    const folders = {
      folders: [{ id: 1, title: "main", userId: 1 }],
    };
    const loginStatus = true;

    render(<Navbar props={{ loading, folders, loginStatus }} />);

    expect(screen.getByText("main")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete folder" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "···" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "New folder" })
    ).toBeInTheDocument();
  });

  it("Should render folders with delete/update", () => {
    const loading = false;
    const folders = {
      folders: [
        { id: 1, title: "main", userId: 1 },
        { id: 2, title: "second", userId: 1 },
      ],
    };
    const loginStatus = true;

    render(<Navbar props={{ loading, folders, loginStatus }} />);

    expect(screen.getByText("main")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete folder" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "···" })).toBeInTheDocument();
  });

  it("Should open delete dialog box", async () => {
    const user = userEvent.setup();
    const loading = false;
    const folders = {
      folders: [
        { id: 1, title: "main", userId: 1 },
        { id: 2, title: "second", userId: 1 },
      ],
    };
    const loginStatus = true;

    render(<Navbar props={{ loading, folders, loginStatus }}></Navbar>);

    const deleteButton = screen.getByRole("button", { name: "Delete folder" });

    await user.click(deleteButton);

    expect(await screen.findByText("Yes, delete folder")).toBeInTheDocument();
  });

  it("Should open delete dialog box", async () => {
    const user = userEvent.setup();
    const loading = false;
    const folders = {
      folders: [
        { id: 1, title: "main", userId: 1 },
        { id: 2, title: "second", userId: 1 },
      ],
    };
    const loginStatus = true;

    render(<Navbar props={{ loading, folders, loginStatus }}></Navbar>);

    const updateButton = screen.getByRole("button", {
      name: "···",
    });

    await user.click(updateButton);

    expect(await screen.findByText("New folder name:")).toBeInTheDocument();
  });

  it("Should show new folder form and hide on cancel", async () => {
    const user = userEvent.setup();
    const loading = false;
    const folders = {
      folders: [{ id: 1, title: "main", userId: 1 }],
    };
    const loginStatus = true;

    render(<Navbar props={{ loading, folders, loginStatus }}></Navbar>);

    const newFolderButton = screen.getByRole("button", {
      name: "New folder",
    });

    await user.click(newFolderButton);

    expect(await screen.findByLabelText("Folder name:")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await user.click(cancelButton);

    expect(screen.queryByLabelText("Folder name:")).not.toBeInTheDocument();
  });
});
