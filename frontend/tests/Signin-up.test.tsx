import Signup from "../src/components/Signup";
import Signin from "../src/components/Signin";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
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
    useOutletContext: () => [loginStatus, setLoginStatus],
  };
});

describe("Signup & Signin", () => {
  it("Should render validation errors on signup", async () => {
    const user = userEvent.setup();

    render(<Signup />);

    const nameInput = screen.getByLabelText("Name");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      await userEvent.type(nameInput, "h".repeat(101));

      await user.click(submitButton);
    });

    expect(
      await screen.findByTestId("usernameError")
    ).not.toBeEmptyDOMElement();

    expect(await screen.findByTestId("nameError")).not.toBeEmptyDOMElement();

    expect(
      await screen.findByTestId("passwordError")
    ).not.toBeEmptyDOMElement();
  });

  it("Should return user not found", async () => {
    const user = userEvent.setup();

    render(<Signin />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await act(async () => {
      await userEvent.type(usernameInput, "notexistingUser");
      await userEvent.type(passwordInput, "notExistingUser");

      await user.click(submitButton);
    });

    expect(await screen.findByTestId("userError")).not.toBeEmptyDOMElement();
  });

  it("Should render error on empty username field", async () => {
    render(<Signin />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    usernameInput.focus();
    passwordInput.focus();

    expect(
      await screen.findByTestId("usernameError")
    ).not.toBeEmptyDOMElement();
    expect(await screen.findByTestId("passwordError")).toBeEmptyDOMElement();
  });

  it("Should render error on empty password field", async () => {
    render(<Signin />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    passwordInput.focus();
    usernameInput.focus();

    expect(
      await screen.findByTestId("passwordError")
    ).not.toBeEmptyDOMElement();
    expect(await screen.findByTestId("usernameError")).toBeEmptyDOMElement();
  });
});
