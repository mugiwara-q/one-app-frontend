import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"
import { Button } from "@ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table"
import { useState } from "react"
import { getMonthFromNumber, getWeekNumber, getWeekStart, getWeekEnd } from "@/_utils/helpers"
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react"
//import { Input } from "@/components/ui/input"

export default function Contacts() {

  const [weekStartView, setWeekStartView] = useState(getWeekStart(new Date()))

  function dayPlus(day: Date, plus: number) {
    return new Date(weekStartView.getFullYear(), weekStartView.getMonth(), day.getDate() + plus)
  }

  const DAYS: Array<string> = [
    "LUNDI " + weekStartView.toLocaleDateString("fr-FR"),
    "MARDI " + dayPlus(weekStartView, 1).toLocaleDateString("fr-FR"),
    "MERCREDI " + dayPlus(weekStartView, 2).toLocaleDateString("fr-FR"),
    "JEUDI " + dayPlus(weekStartView, 3).toLocaleDateString("fr-FR"),
    "VENDREDI " + dayPlus(weekStartView, 4).toLocaleDateString("fr-FR"),
    "SAMEDI " + dayPlus(weekStartView, 5).toLocaleDateString("fr-FR"),
    "DIMANCHE " + dayPlus(weekStartView, 6).toLocaleDateString("fr-FR")
  ]

  const [days, setDays] = useState({
    lun1: "", lun2: "", lun3: "", lun4: "",
    mar1: "", mar2: "", mar3: "", mar4: "",
    mer1: "", mer2: "", mer3: "", mer4: "",
    jeu1: "", jeu2: "", jeu3: "", jeu4: "",
    ven1: "", ven2: "", ven3: "", ven4: "",
    sam1: "", sam2: "", sam3: "", sam4: "",
    dim1: "", dim2: "", dim3: "", dim4: "",
  })

  function renderDays(): React.ReactElement[] {

    const element: React.ReactElement[] = []

    DAYS.map((day: any) => {
      element.push(
        <TableRow key={day} className="rounded-lg py-4">

          <TableCell className="font-semibold">{day}</TableCell>

          <TableCell className="">
            <InputOTP
              value={days.lun1}
              onChange={(newValue) => setDays(days => ({ ...days, ["lun1"]: newValue }))}
              name="createdAt"
              maxLength={4}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              h
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            <InputOTP
              value={days.lun2}
              onChange={(newValue) => setDays(days => ({ ...days, ["lun2"]: newValue }))}
              name="createdAt"
              maxLength={8}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              h
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

          </TableCell>

          <TableCell className="">
            <InputOTP
              value={days.lun3}
              onChange={(newValue) => setDays(days => ({ ...days, ["lun3"]: newValue }))}
              name="createdAt"
              maxLength={8}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              h
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            <InputOTP
              value={"1700"}
              name="createdAt"
              maxLength={8}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              h
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </TableCell>
        </TableRow>
      )
    })

    return (element)
  }

  return (
    <>
      <div className="flex items-center pb-1 border-b">
        <h1 className="font-semibold text-2xl">FEUILLE D'HEURES</h1>
      </div>

      <div className="flex items-center">

        <div className="flex flex-col w-1/6 items-w-1/6 gap-1 text-w-1/6">
          <Button onClick={() => setWeekStartView(new Date(weekStartView.getFullYear(), weekStartView.getMonth(), weekStartView.getDate() - 7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col w-4/6 items-w-4/6 gap-1 text-w-4/6 w-full items-center">
          Semaine {getWeekNumber(weekStartView)} - {getMonthFromNumber(weekStartView.getMonth())} {weekStartView.getFullYear()}
          <p className="text-sm text-muted-foreground">
            Du {getWeekStart(weekStartView).getDate()} {getMonthFromNumber(getWeekStart(weekStartView).getMonth())} au {getWeekEnd(weekStartView).getDate()} {getMonthFromNumber(getWeekEnd(weekStartView).getMonth())}
          </p>
        </div>

        <div className="flex flex-col w-1/6 items-w-1/6 gap-1 text-w-1/6">
          <Button onClick={() => setWeekStartView(new Date(weekStartView.getFullYear(), weekStartView.getMonth(), weekStartView.getDate() + 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </div>




      <div className="flex flex-col center-items text-center overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">
                <div className="">Jour</div>
              </TableHead>
              <TableHead>
                <div className="">Matin</div>
              </TableHead>
              <TableHead>
                <div className="">Soir</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {renderDays()}
          </TableBody>
        </Table>

        <br />
        <Button> Valider cette semaine </Button>
        <br />
      </div>
    </>
  )
}