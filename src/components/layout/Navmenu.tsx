import {
  Home,
  LineChart,
  Package,
  Settings,
  Forklift,
  ShoppingCart,
  ShoppingBasket,
  Users,
  CalendarDays,
  CalendarClock,
  FileAxis3D,
  Menu,
  UserCog

} from "lucide-react"

//import { Badge } from "@ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@ui/sheet"
import { Button } from "@ui/button"
import { Badge } from "@ui/badge"


import { NavLink } from "react-router-dom"
import React from "react"
import { useState, useEffect } from "react"

import { accountService } from "@/_services/account.service"
import { wishItemService } from "@/_services/wishItem.service"
import { vehicleService } from "@/_services/vehicle.service"

// ################################################################################

interface menuDataItem {
  name: string
  link: string
  icon: JSX.Element
}

const MENU: Array<menuDataItem> = [
  { name: "Dashboard", link: "home", icon: <Home className="h-4 w-4" /> },
  { name: "Demandes d'achats", link: "panier", icon: <ShoppingBasket className="h-4 w-4" /> },
  { name: "Achats", link: "achats", icon: <ShoppingCart className="h-4 w-4" /> },
  { name: "Inventaire", link: "inventaire", icon: <Package className="h-4 w-4" /> },
  { name: "Machines", link: "machines", icon: <Forklift className="h-4 w-4" /> },
  { name: "Contacts", link: "contacts", icon: <Users className="h-4 w-4" /> },
  { name: "Feuille d'heures", link: "horaires", icon: <CalendarClock className="h-4 w-4" /> },
  { name: "Calendrier", link: "calendrier", icon: <CalendarDays className="h-4 w-4" /> },
  { name: "Analytics", link: "analytics", icon: <LineChart className="h-4 w-4" /> },
  { name: "Administratif / Devis", link: "administratif", icon: <FileAxis3D className="h-4 w-4" /> },
  { name: "Utilisateurs", link: "utilisateurs", icon: <UserCog className="h-4 w-4" /> },
  { name: "Réglages", link: "reglages", icon: <Settings className="h-4 w-4" /> }
]

const NATIVE_ACCESS = ["home", "horaires", "reglages"]

export default function NavMenu({ isMobile }: { isMobile: boolean }) {

  /***************** SERVICES *****************/
  const [reloadBackend, setReloadBackend] = useState(false)

  const [badges, setBadges] = useState({
    achats: 0,
    machines: 0,
  })

  useEffect(() => {

    // ACHATS
    wishItemService.getWaitingCount()
      .then(res => {
        setBadges(badges => ({ ...badges, ["achats"]: res.data.data }))
      }).catch(e => console.log(e))

    vehicleService.getExpiredInspectionDateCount()
      .then(res => {
        setBadges(badges => ({ ...badges, ["machines"]: res.data.data }))
      }).catch(e => console.log(e))

  }, [reloadBackend])


  /***************** MENU GENERATION *****************/
  const generatedMenuFunc = (isMobile: boolean): React.ReactElement[] => {

    if (isMobile) {
      var navLinkStyleClassName = ({ isActive }: { isActive: boolean }): string => {
        return `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${(!isActive) ? 'text-muted-foreground' : 'bg-muted text-foreground'}`
      }
    }
    else {
      var navLinkStyleClassName = ({ isActive }: { isActive: boolean }): string => {
        return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${(!isActive) ? 'text-muted-foreground' : 'bg-muted text-primary'}`
      }
    }

    const generatedMenu: React.ReactElement[] = []
    for (let itemMenu of MENU) {

      // native access // OR \\ check if token allows it -  for any of r w rw
      if (NATIVE_ACCESS.includes(itemMenu.link)
        || accountService.checkRole(itemMenu.link, ["w", "r", "rw"])) {

        generatedMenu.push(
          <NavLink onClick={() => { setReloadBackend(!reloadBackend) }} to={itemMenu.link} className={navLinkStyleClassName} key={itemMenu.name} end>
            {itemMenu.icon}
            {itemMenu.name}

            {(itemMenu.name === "Achats") && (badges["achats"] > 0) ?
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{badges["achats"]}</Badge> : <></>}
            {(itemMenu.name === "Machines") && (badges["machines"] > 0) ?
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{badges["machines"]}</Badge> : <></>}

          </NavLink>)
      }

    }
    return generatedMenu
  }

  /***************** MOBILE MENU *****************/
  if (isMobile) {
    return (
      <Sheet>

        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="flex flex-col pt-20">
          <nav className="grid gap-2 text-lg font-medium">
            {generatedMenuFunc(isMobile)}
          </nav>

        </SheetContent>
      </Sheet>
    )
  }

  /***************** STANDARD MENU *****************/
  else {
    return (
      <>

        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className=""> Menu </span>
          </a>
        </div>

        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium pb-10 lg:px-4">
            {generatedMenuFunc(isMobile)}
          </nav>
        </div>

      </>
    )
  }
}

// ################################################################################
export const SideMenu = () => {

  /***************** NAVLINK ACTIVE STATE *****************/
  const navLinkStyleClassName = ({ isActive }: { isActive: boolean }): string => {
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${(!isActive) ? 'text-muted-foreground' : 'bg-muted text-primary'}`
  }

  /***************** MENU GENERATION *****************/
  const generatedMenuFunc = (): React.ReactElement[] => {
    const generatedMenu: React.ReactElement[] = []
    for (var itemMenu of MENU) {

      // native access
      // OR
      // check if token allows it -  for any of r w rw
      if (NATIVE_ACCESS.includes(itemMenu.link)
        || accountService.checkRole(itemMenu.link, ["w", "r", "rw"])) {

        generatedMenu.push(
          <NavLink to={itemMenu.link} className={navLinkStyleClassName} key={itemMenu.name} end>
            {itemMenu.icon}
            {itemMenu.name}
            {/*<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            1
          </Badge>*/}
          </NavLink>)
      }

    }
    return generatedMenu
  }

  return (
    <>

      <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <span className=""> Menu </span>
        </a>
      </div>

      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium pb-10 lg:px-4">
          {generatedMenuFunc()}
        </nav>
      </div>

    </>
  )
}

// ################################################################################
export const MobileMenu = () => {

  const navLinkStyleClassName = ({ isActive }: { isActive: boolean }): string => {
    return `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${(!isActive) ? 'text-muted-foreground' : 'bg-muted text-foreground'}`
  }

  const generatedMenuFunc = (): React.ReactElement[] => {
    const generatedMenu: React.ReactElement[] = []
    for (var itemMenu of MENU) {
      generatedMenu.push(
        <NavLink to={itemMenu.link} className={navLinkStyleClassName} key={itemMenu.name} end>
          {itemMenu.icon}
          {itemMenu.name
          /*<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            6
          </Badge>*/}
        </NavLink>
      )
    }
    return generatedMenu
  }

  return (
    <Sheet>

      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col pt-20">
        <nav className="grid gap-2 text-lg font-medium">
          {generatedMenuFunc()}
        </nav>

      </SheetContent>
    </Sheet>
  )
}
