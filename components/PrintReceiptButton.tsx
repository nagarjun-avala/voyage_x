'use client'

import { Button } from "./ui/button";

export function PrintReceiptButton() {
    return (
        <Button
            onClick={() => window.print()}
            variant="outline"
            className="border px-4 py-2 rounded-md"
        >
            🖨️ Print Receipt

            {/* create a custom print layout like a invoice not complete window.print() */}
        </Button>
    );
}
