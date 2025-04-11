import { ThemeToggle } from "@partials/ThemeToggle"

import {
  CircleUser,
  Globe
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import { accountService } from "@/_services/account.service"
import { useNavigate } from "react-router-dom"

export default function Header() {

  /***************** LOGOUT FUNCTION BUTTON *****************/
  let navigate = useNavigate()
  const logout = () => {
    accountService.logout()
    navigate("/", { replace: true })
  }

  return (
    <div>

      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Globe className="h-6 w-6" />
            <span> ONE App </span>
          </a>
        </div>

        <div className="w-full flex-1">

        </div>

        {ThemeToggle()}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem><NavLink to="reglages">Réglages</NavLink></DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => logout()}>Deconnexion</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </header>


    </div>
  )
}