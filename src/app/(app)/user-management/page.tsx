'use client'
import { CommonHeader } from '@/components/common/common-header'
import React from 'react'
import Table from './_components/table'

export default function Page() {
  return (
    <>
      <CommonHeader
        title="User Management"
        subtitle="See all user."
      />
      <Table
        data={[
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
        ]}
        totalItems={3}
      />

    </>
  )
}
