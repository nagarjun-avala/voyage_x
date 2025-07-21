'use client'

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"

interface StyledQRCodeProps {
    value: string
    logoUrl?: string
    size?: number
}

export function StyledQRCode({
    value,
    logoUrl = "/logo.png",
    size = 100,
}: StyledQRCodeProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const qr = new QRCodeStyling({
            width: size,
            height: size,
            data: value,
            image: logoUrl,
            dotsOptions: {
                color: "#000",
                type: "rounded",
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 4,
            },
        })

        if (ref.current) {
            qr.append(ref.current)
        }

        return () => {
            if (ref.current) ref.current.innerHTML = ""
        }
    }, [value, logoUrl, size])

    return <div ref={ref} className="rounded-md" />
}
