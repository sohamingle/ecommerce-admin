"use client"

import { AlignJustifyIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MobileMenu = () => {
    const [open, setOpen] = useState(false)

    const onOpen = () => setOpen(true)

    const onClose = () => setOpen(false)


    const pathname = usePathname()
    const params = useParams()
    const routes = [{
        href: `/${params.storeId}`,
        label: 'Overview',
        active: pathname === `/${params.storeId}`
    },
    {
        href: `/${params.storeId}/billboards`,
        label: 'Billboards',
        active: pathname === `/${params.storeId}/billboards`
    },
    {
        href: `/${params.storeId}/categories`,
        label: 'Categories',
        active: pathname === `/${params.storeId}/categories`
    },
    {
        href: `/${params.storeId}/sizes`,
        label: 'Sizes',
        active: pathname === `/${params.storeId}/sizes`
    },
    {
        href: `/${params.storeId}/colors`,
        label: 'Colors',
        active: pathname === `/${params.storeId}/colors`
    },
    {
        href: `/${params.storeId}/products`,
        label: 'Products',
        active: pathname === `/${params.storeId}/products`
    },
    {
        href: `/${params.storeId}/orders`,
        label: 'Orders',
        active: pathname === `/${params.storeId}/orders`
    },
    {
        href: `/${params.storeId}/settings`,
        label: 'Settings',
        active: pathname === `/${params.storeId}/settings`
    },
    ]


    return (
        <>
            <Button onClick={onOpen} variant={'outline'} size={'icon'}>
                <AlignJustifyIcon />
            </Button>

            <Dialog open={open} as="div" className={'relative z-40 lg:hidden'} onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                <div className="fixed inset-0 z-40 flex">
                    <Dialog.Panel className={'relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-current py-4 pb-6 shadow-xl'}>
                        <div className="flex items-center justify-end px-4">
                            <Button onClick={onClose} variant={'outline'} size={'icon'}>
                                <X/>
                            </Button>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            {routes.map((route) =>
                                <Link href={route.href} key={route.href}
                                onClick={onClose} className={cn("text-lg font-medium transition-colors p-3 hover:text-white hover:dark:text-black", route.active ? "text-white dark:text-black" : "text-muted-foreground")} >{route.label}
                                </Link>)}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}

export default MobileMenu;