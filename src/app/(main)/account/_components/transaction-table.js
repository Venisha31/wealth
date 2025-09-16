"iuse client";
import React from 'react'
import { Clock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryColors } from '@/data/categories';
import { Badge } from '@/components/ui/badge';

export const TransactionTable = ({ transactions }) => {

    const filteredAndSortedTransactions = transactions;
    const handleSort = () => {

    }

    return (
        <div className='space-y-4'>
            {/*Filters*/}

            {/*Transactions*/}
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"><Checkbox /></TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                <div className='flex items-center'>Date</div>
                            </TableHead>
                            <TableHead>Description</TableHead>

                            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                                <div className='flex items-center'>Category</div>
                            </TableHead>

                            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}><div className='flex items-center'>Amount</div></TableHead>

                            <TableHead>Recurring</TableHead>
                            <TableHead className="w-[50px]"></TableHead>

                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransactions !== 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTransactions.map((transaction) => (<TableRow key={transaction.id}>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>{format(new Date(transaction.date), "pp")}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="capitalize">
                                    <span style={{
                                        background: categoryColors[transaction.category],
                                    }} className='px-2 py-1 rounded text-white text-sm'>{transaction.category}
                                    </span></TableCell>
                                <TableCell>
                                    {transaction.isRecurring ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                    >
                                                        <RefreshCw className="h-3 w-3" />
                                                        {
                                                            RECURRING_INTERVALS[
                                                            transaction.recurringInterval
                                                            ]
                                                        }
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-sm">
                                                        <div className="font-medium">Next Date:</div>
                                                        <div>
                                                            {format(
                                                                new Date(transaction.nextRecurringDate),
                                                                "PPP"
                                                            )}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <Badge variant="outline" className="gap-1">
                                            <Clock className="h-3 w-3" />
                                            One-time
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

