import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TaskLivePreview from "../TaskLivePreview";

const axiosGetMock = vi.hoisted(() => vi.fn());

vi.mock("src/utils/axios", () => ({
  default: { get: axiosGetMock },
  endpoints: {
    project: {
      getSpansForObserveProject: () => "/tracer/observe-project-spans/",
      getTracesForObserveProject: () => "/tracer/observe-project-traces/",
      projectSessionList: () => "/tracer/project-session-list/",
      getTrace: (id) => `/tracer/trace/${id}/`,
      traceSession: "/tracer/trace-session/",
      getCallLogs: "/tracer/call-logs/",
      getVoiceCallDetail: "/tracer/voice-call-detail/",
    },
  },
}));

vi.mock("src/components/iconify", () => ({
  default: ({ icon }) => <span data-testid="icon">{icon}</span>,
}));

vi.mock("src/sections/evals/components/DatasetTestMode", () => ({
  JsonValueTree: () => <span>json value</span>,
}));

vi.mock("src/sections/evals/components/EvalResultDisplay", () => ({
  default: () => <div>eval result</div>,
}));

vi.mock("src/sections/evals/components/SpanRowList", () => ({
  default: () => <div>span rows</div>,
}));

const renderPreview = (evalsDetails) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Harness = () => {
    const { control } = useForm({
      defaultValues: {
        filters: [],
        startDate: null,
        endDate: null,
        rowType: "spans",
        evalsDetails,
      },
    });
    return <TaskLivePreview control={control} projectId="project-1" />;
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <Harness />
    </QueryClientProvider>,
  );
};

describe("TaskLivePreview — variable mapping", () => {
  beforeEach(() => {
    axiosGetMock.mockReset();
    axiosGetMock.mockResolvedValue({
      data: {
        result: {
          table: [{ span_id: "span-1", output: { value: "hi" } }],
          metadata: { total_rows: 1 },
          config: [],
        },
      },
    });
  });

  it("renders a mapping whose value is an object instead of tearing down the page", async () => {
    renderPreview([
      {
        id: "eval-1",
        name: "Groundedness",
        mapping: { context: { value: "output.value" }, answer: "output.value" },
      },
    ]);

    expect(await screen.findByText("Variable Mapping")).toBeInTheDocument();
    expect(screen.getByText("context")).toBeInTheDocument();
    expect(screen.getByText("answer")).toBeInTheDocument();
    expect(screen.getByText("invalid mapping")).toBeInTheDocument();
    expect(screen.queryByText("[object Object]")).not.toBeInTheDocument();
  });

  it("flags the object value as invalid while the path value stays resolved", async () => {
    renderPreview([
      {
        id: "eval-1",
        name: "Groundedness",
        mapping: { context: { value: "output.value" }, answer: "output.value" },
      },
    ]);

    await screen.findByText("Variable Mapping");
    expect(screen.getByText("output.value")).toBeInTheDocument();
    expect(screen.getByText("invalid mapping")).toBeInTheDocument();
    expect(screen.queryByText("(not in row)")).not.toBeInTheDocument();
  });
});
