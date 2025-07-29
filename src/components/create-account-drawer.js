"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from '@/app/lib/schema';
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerDescription,
    DrawerFooter,
} from "./ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';

const CreateAccountDrawer = ({ children }) => {

    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors },
        setValue,
        watch,
        reset } = useForm({
            resolver: zodResolver(accountSchema),
            defaultValues: {
                name: "",
                type: "CURRENT",
                balance: "",
                isDefault: false,
            },
        });

        const onSubmit=async(data)=>{
            console.log(data);
        }
    return (
        <div>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
                <DrawerContent >
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    </DrawerHeader>
                    <div className='px-4 pb-4'>
                        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                            <div className='space-y-2'>
                                <label htmlFor="name" className='text-sm font-medium'>Account Name</label>
                                <Input id="name" placeholder="e.g., Main Checking"{...register("name")} />
                                {errors.name && (<p className='text-sm text-red-500'>{errors.name.message}</p>)}
                            </div>
                        </form>
                    </div>

                    <div className='px-4 pb-4'>
                        <form className='space-y-4'>
                            <div className='space-y-2'>
                                <label htmlFor="type" className='text-sm font-medium'>Account Type</label>
                                <Select onValueChange={(value) => setValue("type", value)}
                                    defaultValue={watch("type")}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select Account Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CURRENT">Current</SelectItem>
                                        <SelectItem value="SAVINGS">Savings</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (<p className='text-sm text-red-500'>{errors.type.message}</p>)}
                            </div>
                        </form>
                    </div>

                    <div className='px-4 pb-4'>
                        <form className='space-y-4'>
                            <div className='space-y-2'>
                                <label htmlFor="balance" className='text-sm font-medium'>Initial Balance</label>
                                <Input
                                    id="balance"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"{...register("balance")} />
                                {errors.balance && (<p className='text-sm text-red-500'>{errors.balance.message}</p>)}
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <label
                                htmlFor="isDefault"
                                className="text-base font-medium cursor-pointer"
                            >
                                Set as Default
                            </label>
                            <p className="text-sm text-muted-foreground">
                                This account will be selected as default account for transactions
                            </p>
                        </div>
                        <Switch
                            id="isDefault"
                            checked={watch("isDefault")}
                            onCheckedChange={(checked) => setValue("isDefault", checked)}
                        />
                    </div>

                    <div className='flex gap-4 pt-4'>
                        <DrawerClose asChild><Button type="button" variant="outline" className="flex-1">Cancel
                        </Button></DrawerClose>

                        <Button type="submit" className="flex-1">
                            Create Account
                        </Button>
                    
                      
                         </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default CreateAccountDrawer;
