import { DataTableColumn } from "@/components/common/data-table"
import { UserManagementModel } from "@/features/user-management/type"

const columns: DataTableColumn<UserManagementModel>[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "password",
    label: "Password",
    render: (data) => (
      <span className="font-mono text-muted-foreground">
        {"•".repeat(8)}
      </span>
    ),
  },
  {
    key: "NEXT_PUBLIC_AD_ACCOUNT_ID",
    label: "Ad Account ID",
  },
  {
    key: "NEXT_PUBLIC_FB_ACCESS_TOKEN",
    label: "FB Access Token",
    render: (data) => {
      const token = data.NEXT_PUBLIC_FB_ACCESS_TOKEN
      return (
        <span className="font-mono text-sm text-muted-foreground">
          {token ? `${token.slice(0, 10)}...${token.slice(-6)}` : "-"}
        </span>
      )
    },
  },
]

export default columns
