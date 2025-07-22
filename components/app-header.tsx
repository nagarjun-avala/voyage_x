import React from 'react'
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from './ui/sidebar'
import DynamicBreadcrumb from './ui/DynamicBreadcrumb'

const AppHeader = () => {
    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb />

            </div>
        </header>
    )
}

export default AppHeader