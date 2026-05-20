import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_60%)]">
      <Outlet />
    </main>
  )
}
