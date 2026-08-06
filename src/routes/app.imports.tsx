import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileDown, Play, HelpCircle, FileText } from "lucide-react";
import { toast } from "sonner";

import { UploadZone } from "@/components/app/upload-zone";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/imports")({
  head: () => ({
    meta: [
      { title: "Imports — Retained" },
      {
        name: "description",
        content: "Upload your Zomato and Swiggy order and settlement reports.",
      },
      { property: "og:title", content: "Imports — Retained" },
    ],
  }),
  component: ImportsRoute,
});

function ImportsRoute() {
  const { update } = useWorkspace();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleDemoClick = () => {
    setIsUploading(true);
    toast.info("Simulating demo file upload...", { duration: 2000 });
    setTimeout(() => {
      update({ dataMode: "demo" });
      setIsUploading(false);
      toast.success("Demo data loaded successfully!");
      navigate({ to: "/app/mapping" });
    }, 2000);
  };

  const handleFileUpload = (type: "orders" | "settlements") => async (file: File) => {
    try {
      setIsUploading(true);
      const text = await file.text();
      const isSwiggy = file.name.toLowerCase().includes("swiggy");
      
      let result;
      if (isSwiggy) {
        const { parseSwiggySettlement } = await import("@/lib/parsers/swiggy");
        result = await parseSwiggySettlement(text);
      } else {
        const { parseZomatoSettlement } = await import("@/lib/parsers/zomato");
        result = await parseZomatoSettlement(text);
      }
      
      console.log("Parsed result:", result);
      toast.success(`Successfully parsed ${result.orders.length} orders from ${file.name}`);
      update({ dataMode: "imported" });
    } catch (e: any) {
      toast.error(`Failed to parse file: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Imports & Data Quality</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your order and settlement reports to generate contribution margins.
          </p>
        </div>
        <Button onClick={handleDemoClick} disabled={isUploading} className="gap-2" variant="outline">
          <Play className="h-4 w-4" />
          Load Demo File
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Instructions Guide */}
        <div className="col-span-1 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">How to export your data</h2>
          </div>
          
          <div className="mt-6 space-y-6">
            <div className="relative pl-6 border-l-2 border-muted">
              <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                1
              </span>
              <h3 className="text-sm font-medium">Log into Partner Portals</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign in to your Zomato Restaurant Hub or Swiggy Partner Web.
              </p>
            </div>
            
            <div className="relative pl-6 border-l-2 border-muted">
              <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                2
              </span>
              <h3 className="text-sm font-medium">Navigate to Reports</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Find the "Finance" or "Reports" section. Select the date range you wish to analyze.
              </p>
            </div>
            
            <div className="relative pl-6 border-l-2 border-muted border-transparent">
              <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                3
              </span>
              <h3 className="text-sm font-medium">Download CSV / Excel</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Export both the "Orders" and "Settlements" reports to your computer.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Areas */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <UploadZone
            title="Upload Orders Report"
            description="Drag and drop your Zomato/Swiggy order level report here. Supports .csv and .xlsx"
            onFileSelect={handleFileUpload("orders")}
          />
          <UploadZone
            title="Upload Settlements Report"
            description="Drag and drop your payout settlement report here to reconcile platform deductions."
            onFileSelect={handleFileUpload("settlements")}
          />
        </div>
      </div>
    </div>
  );
}