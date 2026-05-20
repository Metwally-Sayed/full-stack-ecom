import { NavLink } from "react-router-dom"
import { BarChart3, Boxes, ReceiptText, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ReceiptText },
]

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col bg-sidebar px-3 py-4">
      <div className="flex h-12 items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShoppingBag className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Mini Shop</p>
          <p className="text-xs text-muted-foreground">Admin console</p>
        </div>
      </div>
      <Separator className="my-4" />
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className="size-4" />
              {link.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
