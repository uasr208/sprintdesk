import { renderHook, act } from "@testing-library/react";
import React from "react";
import { ToastProvider, useToast } from "../Toast";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe("useToast Custom Hook", () => {
  it("should trigger toast notification without crashing", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast("Task created successfully!", "success");
    });

    expect(result.current.addToast).toBeDefined();
  });
});
