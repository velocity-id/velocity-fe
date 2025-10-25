'use client'

import React from 'react'
import { CommonHeader } from '@/components/common/common-header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const users = [
  {
    name: "Admin Velocity",
    email: "admin@velocity.com",
    password: "password123",
    NEXT_PUBLIC_AD_ACCOUNT_ID: "1234567890",
    NEXT_PUBLIC_FB_ACCESS_TOKEN: "EAABsbCS1iHgBAD3xyz123abc456token",
  },
  {
    name: "Marketing User",
    email: "marketing@velocity.com",
    password: "marketing@2025",
    NEXT_PUBLIC_AD_ACCOUNT_ID: "2233445566",
    NEXT_PUBLIC_FB_ACCESS_TOKEN: "EAABsbCS1iHgBA9pQrStUvWxYz987654321",
  },
  {
    name: "Operator",
    email: "operator@velocity.com",
    password: "operator123",
    NEXT_PUBLIC_AD_ACCOUNT_ID: "9988776655",
    NEXT_PUBLIC_FB_ACCESS_TOKEN: "EAABsbCS1iHgBACDEFGHIJKLMNopqrs123",
  },
]

export default function Page() {
  return (
    <>
      <CommonHeader
        title="User Management"
        subtitle="See all users."
      />

      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Ad Account ID</TableHead>
              <TableHead>Access Token</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.NEXT_PUBLIC_AD_ACCOUNT_ID}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {user.NEXT_PUBLIC_FB_ACCESS_TOKEN}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
